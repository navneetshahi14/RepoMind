"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  ArrowRight,
  Github,
  FileText,
  Zap,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 pb-12">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-brand-500/20 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-brand-700/15 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm text-xs font-medium"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-muted-foreground">
              Now with streaming responses
            </span>
            <Sparkles className="h-3 w-3 text-amber-500" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-3"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-balance">
              Chat with your{" "}
              <span className="gradient-text">entire codebase</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              RepoMind uses advanced RAG to let you have natural language
              conversations with PDFs, GitHub repositories, and documents. Get
              accurate, cited answers in seconds.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
          >
            <Button
              size="xl"
              variant="gradient"
              asChild
              className="w-full sm:w-auto group"
            >
              <Link href="/dashboard">
                Get Started Free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="xl"
              variant="outline"
              asChild
              className="w-full sm:w-auto"
            >
              <Link href="#architecture">
                <Github className="h-4 w-4" />
                View on GitHub
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-6 pt-6 text-xs text-muted-foreground"
          >
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-amber-500" />
              <span>Local-first AI</span>
            </div>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1">
              <Brain className="h-3 w-3 text-brand-500" />
              <span>Llama 3 + Qdrant</span>
            </div>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1">
              <Code2 className="h-3 w-3 text-emerald-500" />
              <span>100% Open Source</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-500/20 to-brand-700/20 blur-3xl" />
            <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs text-muted-foreground ml-2">
                  repomind.ai/chat
                </span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      How does authentication work in this Next.js app?
                    </p>
                  </div>
                </div>
                <div className="ml-11 space-y-2 text-sm">
                  <p>
                    Based on the codebase, authentication uses NextAuth.js with
                    the GitHub provider. The configuration is in{" "}
                    <code className="px-1.5 py-0.5 rounded bg-muted text-xs">
                      src/lib/auth.ts
                    </code>
                    ...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
