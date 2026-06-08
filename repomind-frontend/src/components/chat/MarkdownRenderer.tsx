"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "./CodeBlock";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none",
        "prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg",
        "prose-p:leading-relaxed prose-p:my-2",
        "prose-strong:font-semibold prose-strong:text-foreground",
        "prose-code:text-brand-600 dark:prose-code:text-brand-400",
        "prose-code:before:content-none prose-code:after:content-none",
        "prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs",
        "prose-pre:p-0 prose-pre:bg-transparent",
        "prose-a:text-brand-600 dark:prose-a:text-brand-400",
        "prose-blockquote:border-l-brand-500",
        "prose-ul:my-2 prose-ol:my-2",
        "prose-li:my-1",
        "prose-table:my-4",
        "prose-th:bg-muted prose-th:p-2 prose-th:text-left",
        "prose-td:p-2 prose-td:border-t",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...props }: any) {
            const inline = !className?.includes("language-");
            const value = String(children).replace(/\n$/, "");

            if (inline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }

            const language = className?.replace("language-", "") || "text";
            return <CodeBlock language={language} value={value} />;
          },
          a({ node, ...props }) {
            return (
              <a
                target="_blank"
                rel="noopener noreferrer"
                {...props}
                className="no-underline hover:underline"
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
