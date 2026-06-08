"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useDarkMode } from "@/hooks/useMounted";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  language: string;
  value: string;
}

export function CodeBlock({ language, value }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { isDark, mounted } = useDarkMode();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4 rounded-lg overflow-hidden border border-border/50">
      <div className="flex items-center justify-between px-4 py-1.5 bg-muted/50 border-b border-border/50">
        <span className="text-xs font-mono text-muted-foreground">
          {language || "text"}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? (
            <Check className="h-3 w-3 text-emerald-500" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
      {mounted ? (
        <SyntaxHighlighter
          language={language}
          style={isDark ? oneDark : oneLight}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "0.85rem",
          }}
          showLineNumbers
        >
          {value}
        </SyntaxHighlighter>
      ) : (
        <pre
          className={cn(
            "p-4 text-sm font-mono overflow-x-auto",
            "bg-zinc-950 text-zinc-100"
          )}
        >
          <code>{value}</code>
        </pre>
      )}
    </div>
  );
}
