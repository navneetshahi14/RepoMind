"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Upload,
  GitFork,
  Star,
  FileCode,
  Database,
  Loader2,
  ExternalLink,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { githubService } from "@/services/githubService";
import { useSourceStore } from "@/store/sourceStore";
import { useChatStore } from "@/store/chatStore";
import { formatRelativeTime, extractRepoName } from "@/lib/utils";
import type { RepoInfo } from "@/types";
import Link from "next/link";

export function RepositoryCard({ repo }: { repo: RepoInfo }) {
  const removeRepo = useSourceStore((state) => state.removeRepo);
  const setActiveSource = useChatStore((state) => state.setActiveSource);

  const handleDelete = async () => {
    try {
      await githubService.deleteRepo(repo.id);
      removeRepo(repo.id);
      toast.success("Repository deleted");
    } catch (error) {
      toast.error("Failed to delete repository");
    }
  };

  const handleChat = () => {
    setActiveSource({
      id: repo.id,
      name: repo.name,
      type: "github",
    });
    toast.success(`Now chatting with ${repo.name}`);
  };

  return (
    <motion.div
      key={repo.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <Card className="group hover:border-brand-500/50 hover:shadow-lg transition-all h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                <Github className="h-5 w-5 text-purple-500" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-sm truncate">
                  {repo.name}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {formatRelativeTime(repo.createdAt)}
                </p>
              </div>
            </div>
            <Badge
              variant={
                repo.status === "ready"
                  ? "success"
                  : repo.status === "error"
                  ? "destructive"
                  : "secondary"
              }
              className="text-[10px] flex-shrink-0"
            >
              {repo.status === "processing" ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : null}
              {repo.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {repo.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {repo.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <FileCode className="h-3 w-3" />
                Files
              </div>
              <div className="text-lg font-semibold">{repo.files}</div>
            </div>
            <div className="p-2 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Database className="h-3 w-3" />
                Chunks
              </div>
              <div className="text-lg font-semibold">{repo.chunks}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
            <Button
              size="sm"
              variant="default"
              onClick={handleChat}
              className="flex-1 h-8 text-xs"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Chat
            </Button>
            {/* <Link href="/readme">
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs"
              >
                README
              </Button>
            </Link>
            <Link href="/architecture">
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs"
              >
                Arch
              </Button>
            </Link> */}
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDelete}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
