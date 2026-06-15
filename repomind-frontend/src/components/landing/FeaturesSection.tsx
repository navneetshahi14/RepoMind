"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Github,
  FileType,
  FileCode,
  MessageSquare,
  Sparkles,
  Network,
  Code2,
  FileSearch,
  Layers,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: FileText,
    title: "PDF Chat",
    description:
      "Upload any PDF document and ask questions in natural language. Get accurate, cited answers from your research papers, contracts, books, and reports.",
    color: "from-red-500 to-orange-500",
    bg: "from-red-500/10 to-orange-500/10",
  },
  {
    icon: Github,
    title: "GitHub Repository Chat",
    description:
      "Connect any public GitHub repository and have a conversation with the entire codebase. Understand architecture, find bugs, and onboard faster.",
    color: "from-purple-500 to-pink-500",
    bg: "from-purple-500/10 to-pink-500/10",
  },
  // {
  //   icon: FileType,
  //   title: "Markdown Support",
  //   description:
  //     "Upload markdown documentation, READMEs, and notes. Perfect for technical documentation and knowledge bases.",
  //   color: "from-blue-500 to-cyan-500",
  //   bg: "from-blue-500/10 to-cyan-500/10",
  // },
  // {
  //   icon: FileCode,
  //   title: "Text File Analysis",
  //   description:
  //     "Drop in any text file - logs, code snippets, configuration files. Get instant insights and analysis.",
  //   color: "from-emerald-500 to-teal-500",
  //   bg: "from-emerald-500/10 to-teal-500/10",
  // },
  // {
  //   icon: FileSearch,
  //   title: "README Generator",
  //   description:
  //     "Automatically generate comprehensive, well-structured README files for any GitHub repository using AI.",
  //   color: "from-amber-500 to-orange-500",
  //   bg: "from-amber-500/10 to-orange-500/10",
  // },
  // {
  //   icon: Network,
  //   title: "Architecture Analyzer",
  //   description:
  //     "Visualize system architecture with auto-generated Mermaid diagrams. Understand dependencies at a glance.",
  //   color: "from-indigo-500 to-violet-500",
  //   bg: "from-indigo-500/10 to-violet-500/10",
  // },
  // {
  //   icon: Code2,
  //   title: "API Discovery",
  //   description:
  //     "Automatically discover and document all API endpoints in a codebase. Search, filter, and explore routes.",
  //   color: "from-pink-500 to-rose-500",
  //   bg: "from-pink-500/10 to-rose-500/10",
  // },
  {
    icon: MessageSquare,
    title: "Source Citations",
    description:
      "Every answer includes citations to the exact source files, pages, and line numbers. No hallucinations.",
    color: "from-cyan-500 to-blue-500",
    bg: "from-cyan-500/10 to-blue-500/10",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32 relative">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-medium text-brand-500 mb-4">
            <Sparkles className="h-3 w-3" />
            Powerful Features
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
            Everything you need to{" "}
            <span className="gradient-text">understand code</span>
          </h2>
          <p className="text-muted-foreground text-lg text-pretty">
            Built for developers, by developers. Powerful AI tools that turn
            hours of reading into minutes of asking.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center items-center">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Card className="group h-full hover:border-brand-500/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.bg} opacity-0 group-hover:opacity-100 transition-opacity`}
                  />
                  <CardContent className="p-5 space-y-3 relative">
                    <div
                      className={`h-10 w-10 rounded-lg bg-gradient-to-br ${feature.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <Icon
                        className={`h-5 w-5 bg-gradient-to-br ${feature.color} bg-clip-text`}
                        style={{
                          color: feature.color.split(" ")[1].replace("to-", ""),
                        }}
                      />
                    </div>
                    <h3 className="font-semibold text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
