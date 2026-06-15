"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Sparkles, Copy, Settings } from "lucide-react";
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
import { useProjectStore } from "@/store/projectStore";
import { toast } from "sonner";
import type { ReadmeConfig, GeneratedReadme } from "@/types";
import { copyToClipboard } from "@/lib/utils";

export default function ReadmePage() {
  const project_id = useProjectStore((s) => s.currentproject_id);
  const projects = useProjectStore((s) => s.projects);
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

  // Default the project name to the active project's name so the
  // README prompt isn't empty.
  useEffect(() => {
    if (!project_id) return;
    const project = projects.find((p) => p.id === project_id);
    if (project) {
      setConfig((prev) =>
        prev.projectName ? prev : { ...prev, projectName: project.name },
      );
    }
  }, [project_id, projects]);

  const handleGenerate = async () => {
    if (!project_id) {
      toast.error("Please select a project first");
      return;
    }
    setLoading(true);
    try {
      const result = await readmeService.generateReadme(project_id, config);
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
            Generate comprehensive README files for the active project.
          </p>
        </div>

        {!project_id ? (
          <EmptyState
            icon={FileText}
            title="No project selected"
            description="Pick or create a project from the sidebar to generate a README."
            action={{ label: "Open dashboard", href: "/dashboard" }}
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
                  disabled={loading}
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
                  className="space-y-3"
                >
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        copyToClipboard(generated.content);
                        toast.success("README copied to clipboard");
                      }}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        readmeService.downloadReadme(
                          generated.content,
                          "README.md",
                        )
                      }
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                  <MarkdownViewer
                    content={generated.content}
                    filename="README.md"
                  />
                </motion.div>
              ) : (
                <EmptyState
                  icon={FileText}
                  title="No README generated yet"
                  description="Configure the options and click 'Generate README' to create one for the active project."
                />
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
