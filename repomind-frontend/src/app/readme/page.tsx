"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, Sparkles, Download, Copy, Settings } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MarkdownViewer } from "@/components/markdown/MarkdownViewer";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { readmeService } from "@/services/readmeService";
import { useSourceStore } from "@/store/sourceStore";
import { toast } from "sonner";
import type { ReadmeConfig, GeneratedReadme } from "@/types";
import { GitBranch } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

function ReadmeContent() {
  const searchParams = useSearchParams();
  const repoId = searchParams.get("repoId");
  const repos = useSourceStore((state) => state.repos);

  const [config, setConfig] = useState<Partial<ReadmeConfig>>({
    projectName: "",
    description: "",
    includeInstallation: true,
    includeUsage: true,
    includeAPI: true,
    includeArchitecture: false,
    includeContributing: true,
    tone: "professional",
  });
  const [generated, setGenerated] = useState<GeneratedReadme | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRepoId, setSelectedRepoId] = useState<string | null>(repoId);

  useEffect(() => {
    if (repoId) {
      const repo = repos.find((r) => r.id === repoId);
      if (repo) {
        setConfig((prev) => ({ ...prev, projectName: repo.name }));
        setSelectedRepoId(repoId);
      }
    }
  }, [repoId, repos]);

  const handleGenerate = async () => {
    if (!selectedRepoId) {
      toast.error("Please select a repository first");
      return;
    }
    setLoading(true);
    try {
      const result = await readmeService.generateReadme(selectedRepoId, config);
      setGenerated(result);
      toast.success("README generated!");
    } catch (error) {
      toast.error("Failed to generate README");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            README Generator
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate comprehensive README files for any repository.
          </p>
        </div>

        {repos.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No repositories available"
            description="Connect a GitHub repository first to generate a README."
            action={{ label: "Add Repository", href: "/github" }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Repository</Label>
                  <Select
                    value={selectedRepoId || ""}
                    onValueChange={setSelectedRepoId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a repository" />
                    </SelectTrigger>
                    <SelectContent>
                      {repos.map((repo) => (
                        <SelectItem key={repo.id} value={repo.id}>
                          {repo.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Project Name</Label>
                  <Input
                    value={config.projectName || ""}
                    onChange={(e) =>
                      setConfig({ ...config, projectName: e.target.value })
                    }
                    placeholder="my-awesome-project"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={config.description || ""}
                    onChange={(e) =>
                      setConfig({ ...config, description: e.target.value })
                    }
                    placeholder="A brief description..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select
                    value={config.tone}
                    onValueChange={(value: any) =>
                      setConfig({ ...config, tone: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 pt-2 border-t">
                  {[
                    { key: "includeInstallation", label: "Installation" },
                    { key: "includeUsage", label: "Usage" },
                    { key: "includeAPI", label: "API Documentation" },
                    { key: "includeArchitecture", label: "Architecture" },
                    { key: "includeContributing", label: "Contributing" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <Label className="cursor-pointer">{item.label}</Label>
                      <Switch
                        checked={config[item.key as keyof ReadmeConfig] as boolean}
                        onCheckedChange={(checked) =>
                          setConfig({ ...config, [item.key]: checked })
                        }
                      />
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={loading || !selectedRepoId}
                  variant="gradient"
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-4 w-4" />
                      </motion.div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate README
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <div className="lg:col-span-2">
              {loading ? (
                <LoadingState
                  title="Generating README..."
                  description="This may take a few seconds"
                />
              ) : generated ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <MarkdownViewer
                    content={generated.content}
                    filename="README.md"
                  />
                </motion.div>
              ) : (
                <EmptyState
                  icon={FileText}
                  title="No README generated yet"
                  description="Configure the options and click 'Generate README' to create one."
                />
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default function ReadmePage() {
  return (
    <Suspense fallback={<LoadingState title="Loading..." />}>
      <ReadmeContent />
    </Suspense>
  );
}
