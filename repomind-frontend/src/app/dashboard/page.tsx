"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  MessageSquare,
  Github,
  Layers,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowUpRight,
  Database,
  Zap,
  FolderPlus,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatRelativeTime, truncateText } from "@/lib/utils";
import { useSourceStore } from "@/store/sourceStore";
import { useChatStore } from "@/store/chatStore";
import { useProjectStore } from "@/store/projectStore";
import { useEffect, useState } from "react";
import { uploadService } from "@/services/uploadService";
import { githubService } from "@/services/githubService";
import { toast } from "sonner";

export default function DashboardPage() {
  const sources = useSourceStore((state) => state.sources);
  const repos = useSourceStore((state) => state.repos);
  const setSources = useSourceStore((state) => state.setSources);
  const setRepos = useSourceStore((state) => state.setRepos);
  const setActiveSource = useChatStore((state) => state.setActiveSource);
  const messages = useChatStore((state) => state.messages);

  const project_id = useProjectStore((s) => s.currentproject_id);
  const projects = useProjectStore((s) => s.projects);
  const createProject = useProjectStore((s) => s.createProject);

  const [newProjectName, setNewProjectName] = useState("");

  useEffect(() => {
    if (project_id) loadData();
  }, [project_id]);

  const loadData = async () => {
    if (!project_id) return;
    try {
      const [sourcesData, reposData] = await Promise.all([
        uploadService.getSources(project_id).catch(() => []),
        githubService.getRepos(project_id).catch(() => []),
      ]);
      setSources(sourcesData);
      setRepos(reposData);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    }
  };

  const handleCreateProject = async () => {
    const name = newProjectName.trim();
    if (!name) return;
    try {
      await createProject(name);
      setNewProjectName("");
      toast.success("Project created");
    } catch (err) {
      toast.error("Failed to create project");
    }
  };

  const recentSources = [...sources, ...repos.map(r => ({
    id: r.id,
    name: r.name,
    type: 'github' as const,
    chunks: r.chunks,
    createdAt: r.createdAt,
  }))].slice(0, 5);

  const stats = {
    totalSources: sources.length + repos.length,
    totalRepos: repos.length,
    totalMessages: messages.length,
    totalChunks: sources.reduce((sum, s) => sum + s.chunks, 0) +
                 repos.reduce((sum, r) => sum + r.chunks, 0),
  };

  const quickActions = [
    {
      label: "Upload PDF",
      description: "Chat with documents",
      icon: FileText,
      href: "/upload",
      color: "from-red-500 to-orange-500",
    },
    {
      label: "New Chat",
      description: "Start a conversation",
      icon: MessageSquare,
      href: "/chat",
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "GitHub Repo",
      description: "Analyze a repository",
      icon: Github,
      href: "/github",
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Generate README",
      description: "Create documentation",
      icon: Layers,
      href: "/readme",
      color: "from-amber-500 to-orange-500",
    },
  ];

  // Empty state when no project context yet.
  if (!project_id) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Welcome! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Let's set up your first project.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Create a project</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="My Project"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
              />
              <Button onClick={handleCreateProject} variant="gradient">
                <FolderPlus className="h-4 w-4" />
                Create project
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Welcome back! 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              Project:{" "}
              <span className="font-medium text-foreground">
                {projects.find((p) => p.id === project_id)?.name ?? "..."}
              </span>
            </p>
          </div>
          <Button variant="gradient" asChild>
            <Link href="/upload">
              <Sparkles className="h-4 w-4" />
              Add Source
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Sources"
            value={stats.totalSources}
            icon={Database}
            description="Active knowledge bases"
            delay={0}
          />
          <StatsCard
            title="Repositories"
            value={stats.totalRepos}
            icon={Github}
            description="Connected repos"
            delay={0.05}
          />
          <StatsCard
            title="Messages"
            value={stats.totalMessages}
            icon={MessageSquare}
            description="Total conversations"
            delay={0.1}
          />
          <StatsCard
            title="Vector Chunks"
            value={stats.totalChunks}
            icon={Zap}
            description="Indexed for search"
            delay={0.15}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Sources</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/upload">
                  View All
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentSources.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No sources yet. Upload your first document.
                </div>
              ) : (
                recentSources.map((source) => (
                  <Link
                    key={source.id}
                    href="/chat"
                    onClick={() => setActiveSource({
                      id: source.id,
                      name: source.name,
                      type: source.type,
                    })}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                      source.type === "github"
                        ? "bg-purple-500/10"
                        : "bg-red-500/10"
                    }`}>
                      {source.type === "github" ? (
                        <Github className="h-4 w-4 text-purple-500" />
                      ) : (
                        <FileText className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {truncateText(source.name, 40)}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatRelativeTime(source.createdAt)}</span>
                        <span>·</span>
                        <span>{source.chunks} chunks</span>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div
                      className={`h-9 w-9 rounded-lg bg-gradient-to-br ${action.color} bg-opacity-20 flex items-center justify-center`}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{action.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
