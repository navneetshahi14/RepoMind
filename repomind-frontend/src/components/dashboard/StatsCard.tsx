"use client";

import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatNumber } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  iconColor?: string;
  delay?: number;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  iconColor = "from-brand-400 to-brand-700",
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="group hover:border-brand-500/30 transition-all overflow-hidden relative">
        <div
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br",
            iconColor
          )}
        />
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start justify-between">
            <p className="text-xs font-medium text-muted-foreground">
              {title}
            </p>
            <div
              className={cn(
                "h-9 w-9 rounded-lg bg-gradient-to-br flex items-center justify-center",
                iconColor
              )}
            >
              <Icon className="h-4 w-4 text-white" />
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-bold tracking-tight">
              {typeof value === "number" ? formatNumber(value) : value}
            </h3>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>

          {trend && (
            <div className="flex items-center gap-1 text-xs">
              {trend.isPositive ? (
                <ArrowUp className="h-3 w-3 text-emerald-500" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500" />
              )}
              <span
                className={cn(
                  "font-medium",
                  trend.isPositive ? "text-emerald-500" : "text-red-500"
                )}
              >
                {trend.value}%
              </span>
              <span className="text-muted-foreground">vs last week</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
