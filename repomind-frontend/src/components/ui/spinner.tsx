"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-6 w-6",
    };
    return (
      <div ref={ref} className={cn("flex items-center", className)} {...props}>
        <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      </div>
    );
  }
);
Spinner.displayName = "Spinner";

export { Spinner };
