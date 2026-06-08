"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";
import { useDarkMode } from "@/hooks/useMounted";
import { Spinner } from "@/components/ui/spinner";

interface MermaidViewerProps {
  chart: string;
  className?: string;
}

export function MermaidViewer({ chart, className }: MermaidViewerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isDark, mounted } = useDarkMode();

  useEffect(() => {
    if (!ref.current || !mounted) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? "dark" : "default",
      securityLevel: "loose",
      fontFamily: "var(--font-sans)",
    });

    const render = async () => {
      if (!ref.current) return;
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        ref.current.innerHTML = svg;
      } catch (error) {
        if (ref.current) {
          ref.current.innerHTML = `<pre class="text-destructive text-xs">${
            (error as Error).message
          }</pre>`;
        }
      }
    };

    render();
  }, [chart, isDark, mounted]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`mermaid-container flex items-center justify-center overflow-auto p-4 ${className || ""}`}
    />
  );
}
