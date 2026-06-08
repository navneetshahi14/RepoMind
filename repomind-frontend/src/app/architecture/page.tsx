"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Network,
  Sparkles,
  RefreshCw,
  Layers,
  Database,
  Server,
  Cloud,
  Box,
} from "lucide-react";
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
import { MermaidViewer } from "@/components/markdown/MermaidViewer";
import { MarkdownRenderer } from "@/components/chat/MarkdownRenderer";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { architectureService } from "@/services/architectureService";
import { useSourceStore } from "@/store/sourceStore";
import { toast } from "sonner";
import type { ArchitectureAnalysis } from "@/types";

const iconMap = {
  module: Box,
  service: Server,
  database: Database,
  external: Cloud,
};

function ArchitectureContent() {
  const searchParams = useSearchParams();
  const repoId = searchParams.get("repoId");
  const repos = useSourceStore((state) => state.repos);
  const [selectedRepoId, setSelectedRepoId] = useState<string | null>(repoId);
  const [analysis, setAnalysis] = useState<ArchitectureAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (repoId) setSelectedRepoId(repoId);
  }, [repoId]);

  const handleAnalyze = async () => {
    if (!selectedRepoId) {
      toast.error("Please select a repository");
      return;
    }
    setLoading(true);
    try {
      const result = await architectureService.analyzeArchitecture(selectedRepoId);
      setAnalysis(result);
      toast.success("Architecture analyzed!");
    } catch (error) {
      toast.error("Failed to analyze architecture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Architecture Analyzer
            </h1>
            <p className="text-muted-foreground mt-1">
              Visualize and understand system architecture.
            </p>
          </div>
          {repos.length > 0 && (
            <div className="flex gap-2">
              <Select
                value={selectedRepoId || ""}
                onValueChange={setSelectedRepoId}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select repo" />
                </SelectTrigger>
                <SelectContent>
                  {repos.map((repo) => (
                    <SelectItem key={repo.id} value={repo.id}>
                      {repo.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAnalyze}
                disabled={loading || !selectedRepoId}
                variant="gradient"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Analyze
              </Button>
            </div>
          )}
        </div>

        {repos.length === 0 ? (
          <EmptyState
            icon={Network}
            title="No repositories to analyze"
            description="Connect a GitHub repository to analyze its architecture."
            action={{ label: "Add Repository", href: "/github" }}
          />
        ) : loading ? (
          <LoadingState
            title="Analyzing architecture..."
            description="Generating diagram and explanations"
          />
        ) : analysis ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Modules"
                value={analysis.metrics.modules}
                icon={Box}
                iconColor="from-blue-500 to-cyan-500"
              />
              <StatsCard
                title="Services"
                value={analysis.metrics.services}
                icon={Server}
                iconColor="from-purple-500 to-pink-500"
              />
              <StatsCard
                title="Databases"
                value={analysis.metrics.databases}
                icon={Database}
                iconColor="from-emerald-500 to-teal-500"
              />
              <StatsCard
                title="Externals"
                value={analysis.metrics.externals}
                icon={Cloud}
                iconColor="from-amber-500 to-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">System Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <MarkdownRenderer content={analysis.overview} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Architecture Diagram</CardTitle>
                </CardHeader>
                <CardContent>
                  <MermaidViewer chart={analysis.diagram} />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Detailed Explanation</CardTitle>
              </CardHeader>
              <CardContent>
                <MarkdownRenderer content={analysis.explanation} />
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <EmptyState
            icon={Network}
            title="Ready to analyze"
            description="Select a repository and click 'Analyze' to generate an architecture diagram."
            action={{
              label: "Analyze Now",
              onClick: handleAnalyze,
            }}
          />
        )}
      </div>
    </AppLayout>
  );
}

export default function ArchitecturePage() {
  return (
    <Suspense fallback={<LoadingState title="Loading..." />}>
      <ArchitectureContent />
    </Suspense>
  );
}
