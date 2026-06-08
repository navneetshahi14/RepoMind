"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Globe, Server, Database, Cloud } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, truncateText } from "@/lib/utils";
import type { APIEndpoint } from "@/types";

interface APIListProps {
  apis: APIEndpoint[];
  onSelect?: (api: APIEndpoint) => void;
}

const methodColors: Record<string, string> = {
  GET: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  POST: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  PUT: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  DELETE: "bg-red-500/15 text-red-500 border-red-500/30",
  PATCH: "bg-purple-500/15 text-purple-500 border-purple-500/30",
};

export function APIList({ apis, onSelect }: APIListProps) {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState<string | null>(null);

  const filtered = apis.filter((api) => {
    const matchesSearch =
      api.route.toLowerCase().includes(search.toLowerCase()) ||
      api.file.toLowerCase().includes(search.toLowerCase());
    const matchesMethod = !methodFilter || api.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const methods = Array.from(new Set(apis.map((a) => a.method)));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search routes or files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          <Button
            variant={methodFilter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setMethodFilter(null)}
            className="h-9"
          >
            All
          </Button>
          {methods.map((method) => (
            <Button
              key={method}
              variant={methodFilter === method ? "default" : "outline"}
              size="sm"
              onClick={() => setMethodFilter(method)}
              className={cn("h-9 font-mono text-xs", methodColors[method])}
            >
              {method}
            </Button>
          ))}
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        {filtered.length} of {apis.length} endpoint
        {apis.length !== 1 ? "s" : ""}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No endpoints found
          </div>
        ) : (
          filtered.map((api, idx) => (
            <motion.div
              key={api.id || idx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
            >
              <Card
                className={cn(
                  "group hover:border-brand-500/50 hover:shadow-md transition-all cursor-pointer",
                  onSelect && "cursor-pointer"
                )}
                onClick={() => onSelect?.(api)}
              >
                <div className="p-3 flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-mono text-[10px] font-bold w-16 justify-center",
                      methodColors[api.method]
                    )}
                  >
                    {api.method}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono font-medium truncate">
                      {api.route}
                    </p>
                    <p className="text-xs text-muted-foreground truncate font-mono">
                      {truncateText(api.file, 60)}
                    </p>
                  </div>
                  {api.description && (
                    <Badge variant="secondary" className="text-[10px]">
                      {api.description}
                    </Badge>
                  )}
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
