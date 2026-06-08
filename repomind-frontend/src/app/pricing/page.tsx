"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { Footer, CTASection } from "@/components/landing/CTASection";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    description: "For individuals getting started",
    price: "$0",
    period: "forever",
    features: [
      "10 source uploads",
      "1,000 messages / month",
      "Llama 3 (Local)",
      "PDF, GitHub, Markdown, TXT",
      "Source citations",
      "Community support",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    description: "For professional developers",
    price: "$19",
    period: "per month",
    features: [
      "Unlimited source uploads",
      "Unlimited messages",
      "GPT-4 + Llama 3 + Phi-3",
      "Architecture Analyzer",
      "README Generator",
      "API Discovery",
      "Priority support",
      "Custom embeddings",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For teams and organizations",
    price: "Custom",
    period: "contact us",
    features: [
      "Everything in Pro",
      "Self-hosted deployment",
      "Custom LLM integration",
      "SSO & SAML",
      "Dedicated support",
      "SLA guarantee",
      "Audit logs",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const faqs = [
  {
    q: "Can I use my own LLM?",
    a: "Yes! RepoMind is fully open source and self-hostable. Use any OpenAI-compatible LLM including local models via Ollama.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. All data is processed locally. We never send your documents to external services unless you explicitly use cloud LLMs.",
  },
  {
    q: "What file types are supported?",
    a: "PDF, Markdown (.md), plain text (.txt), and any code files from GitHub repositories (Python, JavaScript, TypeScript, etc.).",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. All paid plans are month-to-month with no long-term commitment. Cancel anytime from your dashboard.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />

      <section className="pt-32 pb-20 relative">
        <div className="absolute inset-0 -z-10 dot-pattern opacity-30" />
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <Badge variant="outline" className="mb-4">
              Pricing
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-balance">
              Simple, transparent <span className="gradient-text">pricing</span>
            </h1>
            <p className="text-muted-foreground text-lg text-pretty">
              Start free. Upgrade when you need more power. No hidden fees.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {plans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card
                  className={cn(
                    "relative h-full",
                    plan.popular && "border-brand-500 shadow-2xl"
                  )}
                >
                  {plan.popular && (
                    <>
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-400 to-brand-700" />
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-brand-400 to-brand-700 text-white text-xs font-medium flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Most Popular
                      </div>
                    </>
                  )}
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-1">
                        {plan.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {plan.description}
                      </p>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">
                        / {plan.period}
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature, fidx) => (
                        <li key={fidx} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      variant={plan.popular ? "gradient" : "outline"}
                      className="w-full group"
                    >
                      <Link href="/dashboard">
                        {plan.cta}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container px-4 md:px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Everything you need to know about RepoMind.
            </p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-sm mb-1">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );
}
