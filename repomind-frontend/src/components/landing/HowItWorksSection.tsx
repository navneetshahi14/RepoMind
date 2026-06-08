"use client";

import { motion } from "framer-motion";
import {
  Upload,
  Brain,
  MessageSquare,
  Sparkles,
  ArrowDown,
} from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Source",
    description: "PDF, GitHub repo, or document",
    detail:
      "Drop your files or paste a GitHub URL. We support PDFs, code repositories, and text documents.",
  },
  {
    icon: Brain,
    title: "AI Processes Content",
    description: "Chunked, embedded, indexed",
    detail:
      "RepoMind intelligently chunks your content and creates vector embeddings for fast semantic search.",
  },
  {
    icon: MessageSquare,
    title: "Ask Questions",
    description: "Natural language, cited answers",
    detail:
      "Chat naturally. Get answers with citations to exact source files, pages, and line numbers.",
  },
  {
    icon: Sparkles,
    title: "Discover Insights",
    description: "Architecture, APIs, READMEs",
    detail:
      "Generate architecture diagrams, discover APIs, and create documentation with one click.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 relative">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-medium text-brand-500 mb-4">
            Simple Process
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
            From <span className="gradient-text">upload</span> to{" "}
            <span className="gradient-text">insight</span> in 60 seconds
          </h2>
          <p className="text-muted-foreground text-lg text-pretty">
            No setup, no configuration. Just upload and start asking.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                <div className="flex items-start gap-4 md:gap-6 p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-brand-500/30 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-400/20 to-brand-700/20 flex items-center justify-center">
                      <Icon className="h-7 w-7 text-brand-500" />
                    </div>
                    <div className="text-center mt-2">
                      <span className="text-xs font-mono text-muted-foreground">
                        STEP {idx + 1}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="text-xs text-brand-500 font-medium uppercase tracking-wide">
                      {step.description}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex justify-center my-2">
                    <ArrowDown className="h-5 w-5 text-muted-foreground animate-bounce" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
