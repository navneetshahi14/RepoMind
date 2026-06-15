"use client";

import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { useUIStore } from "@/store/uiStore";
import { useProjectContext } from "@/hooks/useProjectContext";
import { cn } from "@/lib/utils";

export function AppLayout({ children }: { children: ReactNode }) {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  // Make sure there's always a selected project on authenticated pages.
  useProjectContext();

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 -z-10 grid-bg opacity-30" />
      <div className="absolute inset-0 -z-10 dot-pattern opacity-20" />

      <AppSidebar />

      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300",
          sidebarOpen ? "md:pl-64" : "md:pl-0"
        )}
      >
        <AppHeader />
        <main className="flex-1 px-4 md:px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
