"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    description: "Perfect for individuals and small projects",
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
    cta: "Get Started",
    href: "/dashboard",
    popular: false,
  },
  {
    name: "Pro",
    description: "For professional developers and teams",
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
    href: "/dashboard",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For organizations with custom needs",
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
    href: "mailto:sales@repomind.ai",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-32 relative">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-medium text-brand-500 mb-4">
            Simple Pricing
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
            Start <span className="gradient-text">free</span>, scale as you grow
          </h2>
          <p className="text-muted-foreground text-lg text-pretty">
            No credit card required. Upgrade when you need more power.
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
                  "relative h-full overflow-hidden",
                  plan.popular && "border-brand-500 shadow-lg"
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-400 to-brand-700" />
                )}
                {plan.popular && (
                  <div className="absolute -top-px right-4 -translate-y-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-brand-400 to-brand-700 text-white text-xs font-medium flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
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
                  <ul className="space-y-2 pt-2">
                    {plan.features.map((feature, fidx) => (
                      <li
                        key={fidx}
                        className="flex items-start gap-2 text-sm"
                      >
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
                    className="w-full"
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
