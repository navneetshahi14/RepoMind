"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Home,
  Upload,
  MessageSquare,
  Github,
  FileText,
  Network,
  Code2,
  BarChart3,
  Settings,
  Sparkles,
  Folder,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/uiStore";
import { useProjectStore } from "@/store/projectStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/hooks/ThemeToggle";
import { useState } from "react";
import { toast } from "sonner";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Upload", href: "/upload", icon: Upload, badge: "New" },
  { label: "Chat", href: "/chat", icon: MessageSquare },
  { label: "GitHub", href: "/github", icon: Github },
  // { label: "README", href: "/readme", icon: FileText },
  // { label: "Architecture", href: "/architecture", icon: Network },
  // { label: "API Discovery", href: "/api-discovery", icon: Code2 },
];

export function AppSidebar() {
  const pathname = usePathname();
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const projects = useProjectStore((s) => s.projects);
  const currentproject_id = useProjectStore((s) => s.currentproject_id);
  const selectProject = useProjectStore((s) => s.selectProject);
  const createProject = useProjectStore((s) => s.createProject);
  const [newName, setNewName] = useState("");

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    try {
      await createProject(name);
      setNewName("");
      toast.success("Project created");
    } catch {
      toast.error("Failed to create project");
    }
  };

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.aside
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={cn(
            "hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40 w-64",
            "border-r border-border/50 bg-background/80 backdrop-blur-xl",
          )}
        >
          <div className="flex items-center gap-2 px-6 py-5 border-b border-border/50">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-brand-600 blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-base font-bold gradient-text">RepoMind</h1>
                <p className="text-[10px] text-muted-foreground">
                  AI RAG Platform
                </p>
              </div>
            </Link>
          </div>

          {/* Project selector */}
          <div className="px-3 py-3 border-b border-border/50 space-y-2">
            <div className="flex items-center gap-2 px-2 text-[10px] uppercase tracking-wider text-muted-foreground">
              <Folder className="h-3 w-3" />
              <span>Project</span>
            </div>
            <Select
              value={currentproject_id ?? ""}
              onValueChange={(v) => selectProject(v)}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreate();
              }}
              className="flex items-center gap-1"
            >
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="New project"
                className="flex-1 h-8 px-2 text-xs rounded-md border border-border bg-background"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                aria-label="Create project"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </form>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname?.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-gradient-to-r from-brand-500/15 to-brand-700/5 text-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                      className="absolute left-0 h-5 w-1 rounded-full bg-gradient-to-b from-brand-400 to-brand-600"
                    />
                  )}
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive
                        ? "text-brand-500"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge variant="default" className="text-[9px] h-4 px-1.5">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border/50 p-3 space-y-2">
            {/* <Link
              href="/pricing"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all group"
            >
              <Sparkles className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
              <span>Upgrade to Pro</span>
            </Link> */}
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
