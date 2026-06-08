"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  FileText,
  Github,
  Code2,
  Network,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const suggestions = [
  {
    icon: FileText,
    title: "Summarize a PDF",
    description: "Upload a document and get instant insights",
    href: "/upload",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Github,
    title: "Analyze a GitHub repo",
    description: "Understand any codebase in seconds",
    href: "/github",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: Code2,
    title: "Find API endpoints",
    description: "Discover all routes in a repository",
    href: "/api-discovery",
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: Network,
    title: "Generate architecture diagrams",
    description: "Visualize system structure with Mermaid",
    href: "/architecture",
    color: "from-amber-500/20 to-orange-500/20",
  },
];

const prompts = [
  "What is the overall architecture of this project?",
  "Explain the main API endpoints",
  "How does authentication work?",
  "Generate a README for this repository",
  "Find security vulnerabilities",
  "List all database models",
];

export function ChatWelcome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto space-y-4 mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-medium text-brand-500 mb-4">
          <Sparkles className="h-3 w-3" />
          Powered by Llama 3 + Qdrant
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
          Chat with your{" "}
          <span className="gradient-text">knowledge sources</span>
        </h1>
        <p className="text-muted-foreground text-base md:text-lg text-balance">
          Upload PDFs, GitHub repositories, or documents. Ask questions in
          natural language. Get accurate, cited answers powered by RAG.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mb-12"
      >
        {suggestions.map((suggestion, idx) => {
          const Icon = suggestion.icon;
          return (
            <Link key={idx} href={suggestion.href}>
              <Card className="group p-4 hover:border-brand-500/50 hover:shadow-lg transition-all cursor-pointer h-full">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br ${suggestion.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold mb-1 flex items-center gap-1">
                      {suggestion.title}
                      <ArrowRight className="h-3 w-3 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {suggestion.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-2xl"
      >
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-medium">Try asking</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {prompts.map((prompt, idx) => (
            <Button
              key={idx}
              variant="outline"
              className="justify-start text-left h-auto py-2 px-3 text-xs hover:border-brand-500/50 hover:bg-brand-500/5"
            >
              <span className="truncate">{prompt}</span>
            </Button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
