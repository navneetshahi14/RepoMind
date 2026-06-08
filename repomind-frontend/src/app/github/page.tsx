"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Github as GithubIcon,
  Plus,
  GitBranch,
  Loader2,
  Search,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { RepositoryCard } from "@/components/github/RepositoryCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { githubService } from "@/services/githubService";
import { useSourceStore } from "@/store/sourceStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect } from "react";
import { extractRepoName } from "@/lib/utils";

export default function GitHubPage() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [cloning, setCloning] = useState(false);
  const [search, setSearch] = useState("");
  const repos = useSourceStore((state) => state.repos);
  const setRepos = useSourceStore((state) => state.setRepos);
  const addRepo = useSourceStore((state) => state.addRepo);
  const router = useRouter();

  useEffect(() => {
    loadRepos();
  }, []);

  const loadRepos = async () => {
    try {
      const data = await githubService.getRepos();
      setRepos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClone = async () => {
    if (!url.trim()) {
      toast.error("Please enter a GitHub URL");
      return;
    }

    setCloning(true);
    try {
      const result = await githubService.uploadRepo(url);
      addRepo({
        id: result.repo_id,
        name: extractRepoName(url),
        url: url,
        files: result.files,
        chunks: result.chunks,
        status: "ready",
        createdAt: new Date().toISOString(),
      });
      toast.success("Repository indexed!");
      setUrl("");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to clone repository");
    } finally {
      setCloning(false);
    }
  };

  const filtered = repos.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              GitHub Repositories
            </h1>
            <p className="text-muted-foreground mt-1">
              Connect and analyze any public repository.
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient">
                <Plus className="h-4 w-4" />
                Add Repository
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <GithubIcon className="h-5 w-5" />
                  Connect GitHub Repository
                </DialogTitle>
                <DialogDescription>
                  Enter the URL of a public GitHub repository to clone and
                  index its content.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="https://github.com/user/repo"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleClone()}
                />
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Supported file types:</p>
                  <div className="flex flex-wrap gap-1">
                    {[".py", ".js", ".ts", ".tsx", ".jsx", ".java", ".cpp", ".c", ".md", ".txt"].map((ext) => (
                      <span key={ext} className="px-1.5 py-0.5 rounded bg-muted font-mono">
                        {ext}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleClone} disabled={cloning} variant="gradient">
                  {cloning ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Cloning...
                    </>
                  ) : (
                    <>
                      <GitBranch className="h-4 w-4" />
                      Clone & Index
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {repos.length > 0 && (
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search repositories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyState
            icon={GithubIcon}
            title={repos.length === 0 ? "No repositories connected" : "No results found"}
            description={
              repos.length === 0
                ? "Connect your first GitHub repository to start chatting with your codebase."
                : "Try a different search term."
            }
            action={
              repos.length === 0
                ? { label: "Add Repository", onClick: () => setOpen(true) }
                : undefined
            }
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((repo) => (
              <RepositoryCard key={repo.id} repo={repo} />
            ))}
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
