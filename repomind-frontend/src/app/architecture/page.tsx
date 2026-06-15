"use client";

import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Network,
  Sparkles,
  RefreshCw,
  Database,
  Server,
  Cloud,
  Box,
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MermaidViewer } from "@/components/markdown/MermaidViewer";
import { MarkdownRenderer } from "@/components/chat/MarkdownRenderer";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { architectureService } from "@/services/architectureService";
import { useProjectStore } from "@/store/projectStore";
import { toast } from "sonner";
import type { ArchitectureAnalysis } from "@/types";

function ArchitectureContent() {
  // The old URL was /architecture?repoId=<id>. The new backend
  // expects a project_id; we prefer the active project from the store.
  const project_id = useProjectStore((s) => s.currentproject_id);
  const [analysis, setAnalysis] = useState<ArchitectureAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project_id) {
      void runAnalysis(project_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project_id]);

  const runAnalysis = async (id: string) => {
    setLoading(true);
    try {
      const result = await architectureService.analyzeArchitecture(id);
      setAnalysis(result);
      toast.success("Architecture analyzed!");
    } catch (error) {
      toast.error("Failed to analyze architecture");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!project_id) {
      toast.error("Please select a project first");
      return;
    }
    await runAnalysis(project_id);
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
          {project_id ? (
            <Button
              onClick={handleAnalyze}
              disabled={loading}
              variant="gradient"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {analysis ? "Re-analyze" : "Analyze"}
            </Button>
          ) : null}
        </div>

        {!project_id ? (
          <EmptyState
            icon={Network}
            title="No project selected"
            description="Pick or create a project from the sidebar to analyze its architecture."
            action={{ label: "Open dashboard", href: "/dashboard" }}
          />
        ) : loading && !analysis ? (
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

              {analysis.diagram ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Architecture Diagram</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MermaidViewer chart={analysis.diagram} />
                  </CardContent>
                </Card>
              ) : null}
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
            description="Click 'Analyze' to generate an architecture overview for the active project."
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
