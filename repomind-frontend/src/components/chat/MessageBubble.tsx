"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, User, Copy, Check, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { CitationCard } from "./CitationCard";
import { Spinner } from "@/components/ui/spinner";
import { copyToClipboard } from "@/lib/utils";
import type { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: ChatMessage;
  onRegenerate?: () => void;
}

export function MessageBubble({ message, onRegenerate }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await copyToClipboard(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group flex gap-3 md:gap-4 px-4 py-6",
        isUser ? "bg-transparent" : "bg-muted/30"
      )}
    >
      <div className="flex-shrink-0">
        <Avatar
          className={cn(
            "h-8 w-8 border",
            isUser
              ? "bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800"
              : "bg-gradient-to-br from-brand-400 to-brand-700"
          )}
        >
          <AvatarFallback
            className={cn(
              "text-xs font-medium",
              isUser
                ? "text-zinc-700 dark:text-zinc-200"
                : "text-white"
            )}
          >
            {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            {isUser ? "You" : "RepoMind AI"}
          </span>
          {message.model && !isUser && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-500 font-mono">
              {message.model}
            </span>
          )}
        </div>

        <div className="text-sm leading-relaxed">
          {message.isStreaming && !message.content ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Spinner size="sm" />
              <span className="text-xs">Thinking...</span>
            </div>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
          {message.isStreaming && message.content && (
            <span className="inline-block w-2 h-4 bg-brand-500 ml-0.5 animate-pulse" />
          )}
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span className="font-medium">
                {message.sources.length} source
                {message.sources.length > 1 ? "s" : ""}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {message.sources.map((citation, idx) => (
                <CitationCard key={idx} citation={citation} index={idx} />
              ))}
            </div>
          </div>
        )}

        {!message.isStreaming && !isUser && (
          <div className="flex items-center gap-1 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-7 px-2 text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-500 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
            {onRegenerate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRegenerate}
                className="h-7 px-2 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Regenerate
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
            >
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
            >
              <ThumbsDown className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
