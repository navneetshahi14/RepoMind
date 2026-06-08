"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Code2, Sparkles, RefreshCw } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APIList } from "@/components/github/APIList";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { LoadingState } from "@/components/dashboard/LoadingState";
import { apiDiscoveryService } from "@/services/apiDiscoveryService";
import { useSourceStore } from "@/store/sourceStore";
import { toast } from "sonner";
import type { APIEndpoint } from "@/types";

function APIDiscoveryContent() {
  const searchParams = useSearchParams();
  const repoId = searchParams.get("repoId");
  const repos = useSourceStore((state) => state.repos);
  const [selectedRepoId, setSelectedRepoId] = useState<string | null>(repoId);
  const [apis, setApis] = useState<APIEndpoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (repoId) setSelectedRepoId(repoId);
  }, [repoId]);

  const handleDiscover = async () => {
    if (!selectedRepoId) {
      toast.error("Please select a repository");
      return;
    }
    setLoading(true);
    try {
      const result = await apiDiscoveryService.discoverAPIs(selectedRepoId);
      setApis(result);
      toast.success(`Discovered ${result.length} endpoints`);
    } catch (error) {
      toast.error("Failed to discover APIs");
    } finally {
      setLoading(false);
    }
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
                onClick={handleDiscover}
                disabled={loading || !selectedRepoId}
                variant="gradient"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Discover
              </Button>
            </div>
          )}
        </div>

        {repos.length === 0 ? (
          <EmptyState
            icon={Code2}
            title="No repositories available"
            description="Connect a GitHub repository to discover its APIs."
            action={{ label: "Add Repository", href: "/github" }}
          />
        ) : loading ? (
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
            description="Select a repository and click 'Discover' to find all API endpoints."
            action={{ label: "Discover APIs", onClick: handleDiscover }}
          />
        )}
      </div>
    </AppLayout>
  );
}

export default function APIDiscoveryPage() {
  return (
    <Suspense fallback={<LoadingState title="Loading..." />}>
      <APIDiscoveryContent />
    </Suspense>
  );
}
