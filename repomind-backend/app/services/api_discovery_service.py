"""
Static analysis pass over a project's source files that extracts
HTTP API endpoint declarations.

We do simple regex/line-based scanning (no AST) because the goal is
just a discovery overview, not a complete static-typing analysis.
Supported patterns:

  Python / FastAPI
    @app.get("/route")
    @app.post('/route')
    @app.route("/route", methods=["GET"])
    @router.put("/users/{id}")
    @some_router.delete("/items")

  Python / Flask
    @app.route("/route")
    @app.route("/route", methods=["POST"])

  JavaScript / TypeScript / Express
    app.get('/route', ...)
    router.post("/route", ...)
    app.use("/api", ...)
"""

import re
from typing import Iterable, List, Set

from sqlalchemy.orm import Session

from app.models.chunk_model import Chunk
from app.models.file_node_model import FileNode
from app.repositories.chunk_repository import get_chunks_by_file_nodes
from app.repositories.file_node_repository import get_project_file_nodes
from app.repositories.source_repository import get_project_sources
from app.schema.analyzer_schema import APIEndpointResponse


# File extensions we know how to scan.
CODE_EXTENSIONS: Set[str] = {".py", ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"}


# ---------------------------------------------------------------------------
# Pattern tables
# ---------------------------------------------------------------------------

# Python decorator-style: @app.get("/x"), @router.post("/y")
_PY_DECORATOR_RE = re.compile(
    r"""@(?P<obj>[A-Za-z_][\w.]*)\s*\.\s*
        (?P<verb>get|post|put|patch|delete|route)\s*\(
        \s*['"](?P<route>[^'"]+)['"]
    """,
    re.VERBOSE,
)

# @app.route("/x", methods=["GET", "POST"])
_PY_ROUTE_METHODS_RE = re.compile(
    r"""@(?P<obj>[A-Za-z_][\w.]*)\s*\.\s*route\s*\(
        \s*['"](?P<route>[^'"]+)['"][^)]*?methods\s*=\s*\[
        \s*(?P<methods>[^\]]+?)\s*
        \]
    """,
    re.VERBOSE | re.DOTALL,
)

# Express: app.get('/x', ...), router.post("/y", ...)
_JS_CALL_RE = re.compile(
    r"""(?P<obj>app|router)\s*\.\s*
        (?P<verb>get|post|put|patch|delete|use|all)\s*\(
        \s*['"](?P<route>[^'"]+)['"]
    """,
    re.VERBOSE,
)

# Express: app.METHOD("/x", handler) on a single line
_JS_METHOD_VERB_RE = re.compile(
    r"""(?P<obj>app|router)\s*\.\s*
        (?P<verb>get|post|put|patch|delete|all)\s*\(
        \s*['"](?P<route>[^'"]+)['"]
    """,
    re.VERBOSE,
)

METHOD_NAMES = {"get", "post", "put", "patch", "delete"}


# ---------------------------------------------------------------------------
# Per-file scanner
# ---------------------------------------------------------------------------

def _scan_python(text: str) -> Iterable[APIEndpointResponse]:
    line_offset_for = _line_offset_index(text)

    for m in _PY_DECORATOR_RE.finditer(text):
        verb = m.group("verb").lower()
        if verb == "route":
            # Bare @app.route("/x") defaults to GET on Flask, but FastAPI's
            # @app.route isn't really used; treat as GET.
            method = "GET"
        else:
            method = verb.upper()
        yield APIEndpointResponse(
            method=method,
            route=m.group("route"),
            file="",  # filled in by the caller
            path="",
            line_number=_line_from_index(line_offset_for, m.start()),
        )

    for m in _PY_ROUTE_METHODS_RE.finditer(text):
        methods_blob = m.group("methods")
        for raw in re.findall(r"['\"]([A-Z]+)['\"]", methods_blob):
            yield APIEndpointResponse(
                method=raw.upper(),
                route=m.group("route"),
                file="",
                path="",
                line_number=_line_from_index(line_offset_for, m.start()),
            )


def _scan_javascript(text: str) -> Iterable[APIEndpointResponse]:
    line_offset_for = _line_offset_index(text)
    for m in _JS_CALL_RE.finditer(text):
        verb = m.group("verb").lower()
        if verb == "use":
            # app.use('/api', router) — middleware, not a real endpoint
            continue
        if verb == "all":
            method = "ALL"
        elif verb in METHOD_NAMES:
            method = verb.upper()
        else:
            continue
        yield APIEndpointResponse(
            method=method,
            route=m.group("route"),
            file="",
            path="",
            line_number=_line_from_index(line_offset_for, m.start()),
        )


def _line_offset_index(text: str) -> List[int]:
    """Return a list of byte offsets where each line starts (0-indexed)."""
    offsets = [0]
    for i, ch in enumerate(text):
        if ch == "\n":
            offsets.append(i + 1)
    return offsets


def _line_from_index(offsets: List[int], idx: int) -> int:
    # binary search would be marginally faster but n is tiny per file
    line = 1
    for off in offsets:
        if off > idx:
            break
        line += 1
    return line


def _file_full_text(file_node: FileNode, chunks: List[Chunk]) -> str:
    """Reassemble a file's text from its chunks (ordered by chunk_index)."""
    file_chunks = sorted(
        (c for c in chunks if c.file_node_id == file_node.id),
        key=lambda c: c.chunk_index,
    )
    return "\n".join(c.content for c in file_chunks)


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def discover_project_apis(
    db: Session,
    project_id,
) -> List[APIEndpointResponse]:
    """
    Scan every code file in the project and return the discovered
    API endpoints. One row per (method, route) — duplicates across
    files are kept (the file path distinguishes them).
    """
    sources = get_project_sources(db, project_id)
    if not sources:
        return []

    file_nodes = get_project_file_nodes(db, project_id)
    if not file_nodes:
        return []

    # Filter to code files only.
    code_nodes = [
        n for n in file_nodes
        if (n.extension or "").lower() in CODE_EXTENSIONS
    ]
    if not code_nodes:
        return []

    node_ids = [n.id for n in code_nodes]
    chunks = get_chunks_by_file_nodes(db, node_ids)

    endpoints: List[APIEndpointResponse] = []
    for node in code_nodes:
        text = _file_full_text(node, chunks)
        if not text:
            continue
        ext = (node.extension or "").lower()
        scanner = _scan_python if ext == ".py" else _scan_javascript
        for ep in scanner(text):
            # Decorator/call findings don't carry a file path — attach it.
            ep.file = node.name
            ep.path = node.path
            endpoints.append(ep)

    # Stable order: by file, then line.
    endpoints.sort(key=lambda e: (e.path, e.line_number or 0, e.route))
    return endpoints
