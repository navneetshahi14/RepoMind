"use client";

import { motion } from "framer-motion";
import { type LucideIcon, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-2xl border border-dashed border-border bg-muted/20",
        className
      )}
    >
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-brand-600 blur-2xl opacity-20" />
        <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-400/20 to-brand-600/20 flex items-center justify-center">
          <Icon className="h-8 w-8 text-brand-500" />
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4 text-balance">
          {description}
        </p>
      )}
      {action && (
        <Button
          onClick={action.onClick}
          variant="gradient"
          size="sm"
          asChild={!!action.href}
        >
          {action.href ? (
            <a href={action.href}>{action.label}</a>
          ) : (
            action.label
          )}
        </Button>
      )}
    </motion.div>
  );
}
