"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useChatStore } from "@/store/chatStore";
import { useSourceStore } from "@/store/sourceStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Github, Database, Plus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { formatRelativeTime, truncateText } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const activeSource = useChatStore((state) => state.activeSource);
  const setActiveSource = useChatStore((state) => state.setActiveSource);
  const sources = useSourceStore((state) => state.sources);
  const repos = useSourceStore((state) => state.repos);
  const [showSources, setShowSources] = useState(false);

  const allSources = [
    ...sources.map(s => ({ ...s, type: s.type as 'pdf' | 'markdown' | 'text' })),
    ...repos.map(r => ({
      id: r.id,
      name: r.name,
      type: 'github' as const,
      chunks: r.chunks,
      createdAt: r.createdAt,
    })),
  ];

  return (
    <AppLayout>
      <div className="flex gap-4 -mx-4 md:-mx-6 -my-6 h-[calc(100vh-3.5rem)]">
        <motion.aside
          initial={false}
          animate={{ width: showSources ? 280 : 0 }}
          className="border-r border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden flex-shrink-0"
        >
          <div className="w-[280px] h-full flex flex-col p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm">Sources</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/upload">
                  <Plus className="h-3 w-3" />
                </Link>
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin">
              {allSources.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-xs">
                  No sources yet.{" "}
                  <Link href="/upload" className="text-brand-500 hover:underline">
                    Upload one
                  </Link>
                </div>
              ) : (
                allSources.map((source) => (
                  <button
                    key={source.id}
                    onClick={() => setActiveSource({
                      id: source.id,
                      name: source.name,
                      type: source.type,
                    })}
                    className={cn(
                      "w-full text-left p-2 rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-2",
                      activeSource?.id === source.id && "bg-brand-500/10 border border-brand-500/30"
                    )}
                  >
                    {source.type === "github" ? (
                      <Github className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    ) : (
                      <FileText className="h-4 w-4 text-red-500 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        {truncateText(source.name, 30)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {source.chunks} chunks
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </motion.aside>

        <div className="flex-1 flex flex-col min-w-0">
          {activeSource ? (
            <div className="border-b border-border/50 px-4 py-2 flex items-center gap-3 bg-background/50 backdrop-blur-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSources(!showSources)}
              >
                <Database className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 min-w-0">
                {activeSource.type === "github" ? (
                  <Github className="h-4 w-4 text-purple-500 flex-shrink-0" />
                ) : (
                  <FileText className="h-4 w-4 text-red-500 flex-shrink-0" />
                )}
                <span className="text-sm font-medium truncate">
                  {activeSource.name}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase">
                  {activeSource.type}
                </span>
              </div>
              <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                <Sparkles className="h-3 w-3" />
                AI Ready
              </div>
            </div>
          ) : null}

          <ChatWindow />
        </div>
      </div>
    </AppLayout>
  );
}
