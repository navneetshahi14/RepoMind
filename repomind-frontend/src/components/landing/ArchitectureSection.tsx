"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Database,
  Layers,
  Cpu,
  Server,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stack = [
  { name: "Next.js 15", role: "Frontend", color: "text-zinc-500" },
  { name: "FastAPI", role: "Backend", color: "text-emerald-500" },
  { name: "Qdrant", role: "Vector DB", color: "text-red-500" },
  { name: "Ollama", role: "LLM Runtime", color: "text-purple-500" },
  { name: "Llama 3", role: "Language Model", color: "text-blue-500" },
  { name: "BGE Small", role: "Embeddings", color: "text-amber-500" },
];

const steps = [
  {
    icon: Layers,
    title: "1. Ingest",
    description:
      "Upload PDFs, GitHub repos, or documents. Documents are chunked and split into manageable contexts.",
  },
  {
    icon: Brain,
    title: "2. Embed",
    description:
      "Text chunks are converted to vector embeddings using BGE-Small and stored in Qdrant.",
  },
  {
    icon: Database,
    title: "3. Retrieve",
    description:
      "Your question is embedded and used to find the most semantically similar chunks via cosine similarity.",
  },
  {
    icon: Cpu,
    title: "4. Generate",
    description:
      "Retrieved context + your question are sent to Llama 3 via Ollama to generate accurate, cited answers.",
  },
];

export function ArchitectureSection() {
  return (
    <section id="architecture" className="py-20 md:py-32 relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-brand-500/5 to-transparent" />

      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-medium text-brand-500 mb-4">
            <Server className="h-3 w-3" />
            Built With Modern Stack
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
            A <span className="gradient-text">production-grade</span> RAG
            architecture
          </h2>
          <p className="text-muted-foreground text-lg text-pretty">
            RepoMind uses the same architecture that powers modern AI search
            systems, fully open source and self-hostable.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="relative h-full">
                    <CardContent className="p-5 space-y-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-brand-400/20 to-brand-600/20 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-brand-500" />
                      </div>
                      <h3 className="font-semibold text-sm">{step.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                      {idx < steps.length - 1 && (
                        <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-500 z-10" />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">Tech Stack</h3>
              <p className="text-sm text-muted-foreground">
                Battle-tested, open source, and blazing fast
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {stack.map((tech, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="hover:border-brand-500/50 transition-all">
                    <CardContent className="p-4 text-center space-y-1">
                      <p className="text-sm font-semibold">{tech.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {tech.role}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
