"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, FileText } from "lucide-react";
import { motion } from "framer-motion";
import type { Citation } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { truncateText } from "@/lib/utils";

interface CitationCardProps {
  citation: Citation;
  index: number;
}

export function CitationCard({ citation, index }: CitationCardProps) {
  const [copied, setCopied] = useState(false);

  const copyPath = () => {
    navigator.clipboard.writeText(citation.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="group hover:border-brand-500/50 transition-all hover:shadow-md">
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-gradient-to-br from-brand-400/20 to-brand-600/20 flex items-center justify-center group-hover:from-brand-400/30 group-hover:to-brand-600/30 transition-colors">
              <FileText className="h-4 w-4 text-brand-500" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-foreground truncate">
                  {truncateText(citation.file, 30)}
                </span>
                {citation.page && (
                  <Badge variant="outline" className="text-[9px] h-4 px-1">
                    p.{citation.page}
                  </Badge>
                )}
                <Badge
                  variant="secondary"
                  className="text-[9px] h-4 px-1.5 ml-auto"
                >
                  {(citation.score * 100).toFixed(0)}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate font-mono">
                {truncateText(citation.path, 50)}
              </p>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={copyPath}
                className="h-7 w-7"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
