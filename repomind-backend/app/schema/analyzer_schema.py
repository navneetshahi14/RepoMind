from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field


class ReadmeConfig(BaseModel):
    """Input from the README generator UI."""

    project_name: str = ""
    description: str = ""
    include_installation: bool = True
    include_usage: bool = True
    include_api: bool = True
    include_architecture: bool = False
    include_contributing: bool = True
    tone: str = "professional"  # professional | casual | technical


class GeneratedReadmeResponse(BaseModel):
    content: str


class APIEndpointResponse(BaseModel):
    """One discovered HTTP endpoint."""

    method: str
    route: str
    file: str
    path: str
    line_number: Optional[int] = None


class APIDiscoveryResponse(BaseModel):
    endpoints: List[APIEndpointResponse]


class ArchitectureResponse(BaseModel):
    """Markdown architecture summary returned to the UI."""

    overview: str
    explanation: str
    diagram: str
