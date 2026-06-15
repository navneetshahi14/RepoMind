"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code2, Sparkles, RefreshCw } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { APIList } from "@/components/github/APIList";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { apiDiscoveryService } from "@/services/apiDiscoveryService";
import { useProjectStore } from "@/store/projectStore";
import { toast } from "sonner";
import type { APIEndpoint } from "@/types";

export default function APIDiscoveryPage() {
  const project_id = useProjectStore((s) => s.currentproject_id);
  const [apis, setApis] = useState<APIEndpoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project_id) {
      void runDiscovery(project_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project_id]);

  const runDiscovery = async (id: string) => {
    setLoading(true);
    try {
      const result = await apiDiscoveryService.discoverAPIs(id);
      setApis(result);
      toast.success(`Discovered ${result.length} endpoints`);
    } catch (error) {
      toast.error("Failed to discover APIs");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscover = async () => {
    if (!project_id) {
      toast.error("Please select a project first");
      return;
    }
    await runDiscovery(project_id);
  };

  const methods = apis.reduce(
    (acc, api) => {
      acc[api.method] = (acc[api.method] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              API Discovery
            </h1>
            <p className="text-muted-foreground mt-1">
              Automatically discover and explore API endpoints.
            </p>
          </div>
          {project_id ? (
            <Button
              onClick={handleDiscover}
              disabled={loading}
              variant="gradient"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {apis.length > 0 ? "Re-discover" : "Discover"}
            </Button>
          ) : null}
        </div>

        {!project_id ? (
          <EmptyState
            icon={Code2}
            title="No project selected"
            description="Pick or create a project from the sidebar to discover its API endpoints."
            action={{ label: "Open dashboard", href: "/dashboard" }}
          />
        ) : loading && apis.length === 0 ? (
          <LoadingState
            title="Discovering APIs..."
            description="Analyzing the codebase for endpoints"
          />
        ) : apis.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(methods).map(([method, count]) => (
                <Card key={method} className="text-center">
                  <CardContent className="p-4">
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {method}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <APIList apis={apis} />
          </motion.div>
        ) : (
          <EmptyState
            icon={Code2}
            title="Ready to discover APIs"
            description="Click 'Discover' to scan the active project's source files for API endpoints."
            action={{ label: "Discover APIs", onClick: handleDiscover }}
          />
        )}
      </div>
    </AppLayout>
  );
}
