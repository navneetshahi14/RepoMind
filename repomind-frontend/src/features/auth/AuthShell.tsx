"use client";

import Link from "next/link";
import { Brain, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/hooks/ThemeToggle";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerPrompt: string;
  footerLinkLabel: string;
  footerLinkHref: string;
}

export function AuthShell({
  title,
  subtitle,
  children,
  footerPrompt,
  footerLinkLabel,
  footerLinkHref,
}: AuthShellProps) {
  return (
    <div className="min-h-screen w-full bg-background">
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="container flex h-14 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold gradient-text">RepoMind</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="grid min-h-screen lg:grid-cols-2">
        <div className="flex items-center justify-center px-4 py-20 sm:px-8">
          <div className="w-full max-w-md space-y-6 animate-fade-in">
            <div className="space-y-2 text-center lg:text-left">
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
            {children}
            <p className="text-center text-sm text-muted-foreground lg:text-left">
              {footerPrompt}{" "}
              <Link
                href={footerLinkHref}
                className="font-medium text-primary hover:underline"
              >
                {footerLinkLabel}
              </Link>
            </p>
          </div>
        </div>

        <div className="relative hidden lg:flex items-center justify-center overflow-hidden border-l border-border/50 bg-gradient-to-br from-brand-950 via-background to-brand-900">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="absolute inset-0 bg-gradient-radial from-brand-500/20 via-transparent to-transparent" />

          <div className="relative z-10 max-w-md space-y-6 px-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 shadow-2xl glow-strong">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Chat with your code, docs, and repos
            </h2>
            <p className="text-muted-foreground">
              Connect a GitHub repo, drop in a PDF, or paste some text. RepoMind
              indexes everything and lets you ask questions in plain English.
            </p>
            <div className="grid grid-cols-3 gap-3 pt-4">
              {["FastAPI", "Qdrant", "Ollama"].map((tag) => (
                <div
                  key={tag}
                  className="rounded-lg border border-border/50 bg-background/40 backdrop-blur-sm px-3 py-2 text-xs font-medium text-muted-foreground"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
