"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Download, Code2, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/chat/MarkdownRenderer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { copyToClipboard, truncateText } from "@/lib/utils";

interface MarkdownViewerProps {
  content: string;
  filename?: string;
  showActions?: boolean;
  maxHeight?: string;
}

export function MarkdownViewer({
  content,
  filename = "document.md",
  showActions = true,
  maxHeight = "600px",
}: MarkdownViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      {showActions && (
        <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-border/50 bg-muted/30">
          <div className="flex items-center gap-2 min-w-0">
            <FileJson className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs font-mono text-muted-foreground truncate">
              {truncateText(filename, 40)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1 text-emerald-500"
                  >
                    <Check className="h-3 w-3" />
                    <span className="text-xs">Copied</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-7 px-2"
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="preview" className="w-full">
        <div className="px-4 pt-2 border-b border-border/50">
          <TabsList className="h-8 bg-transparent p-0">
            <TabsTrigger
              value="preview"
              className="h-8 data-[state=active]:bg-muted"
            >
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="raw"
              className="h-8 data-[state=active]:bg-muted"
            >
              <Code2 className="h-3 w-3 mr-1" />
              Raw
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="preview" className="m-0">
          <div
            className="p-6 overflow-auto scrollbar-thin"
            style={{ maxHeight }}
          >
            <MarkdownRenderer content={content} />
          </div>
        </TabsContent>
        <TabsContent value="raw" className="m-0">
          <pre
            className="p-4 text-xs font-mono overflow-auto bg-muted/30 scrollbar-thin"
            style={{ maxHeight }}
          >
            {content}
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}
