"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Github,
  FileType,
  FileCode,
  MoreVertical,
  Trash2,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRelativeTime, truncateText } from "@/lib/utils";
import type { Source, SourceType } from "@/types";
import Link from "next/link";
import { useSourceStore } from "@/store/sourceStore";
import { useChatStore } from "@/store/chatStore";
import { toast } from "sonner";

interface SourceCardProps {
  source: Source;
  onDelete?: (id: string) => void;
}

const iconMap: Record<SourceType, any> = {
  pdf: FileText,
  github: Github,
  // markdown: FileType,
  // text: FileCode,
};

const colorMap: Record<SourceType, string> = {
  pdf: "from-red-500/20 to-orange-500/20 text-red-500",
  github: "from-purple-500/20 to-pink-500/20 text-purple-500",
  // markdown: "from-blue-500/20 to-cyan-500/20 text-blue-500",
  // text: "from-emerald-500/20 to-teal-500/20 text-emerald-500",
};

export function SourceCard({ source, onDelete }: SourceCardProps) {
  const Icon = iconMap[source.type];
  const removeSource = useSourceStore((state) => state.removeSource);
  const setActiveSource = useChatStore((state) => state.setActiveSource);

  const handleChat = () => {
    setActiveSource({
      id: source.id,
      name: source.name,
      type: source.type,
    });
    toast.success(`Now chatting with ${source.name}`);
  };

  const handleDelete = () => {
    removeSource(source.id);
    onDelete?.(source.id);
    toast.success(`${source.name} removed`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group hover:border-brand-500/50 hover:shadow-lg transition-all h-full">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div
              className={`h-10 w-10 rounded-lg bg-gradient-to-br ${colorMap[source.type]} flex items-center justify-center flex-shrink-0`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleChat}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat with this
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-sm truncate">
              {truncateText(source.name, 32)}
            </h3>
            {source.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {source.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-[10px]">
              {source.chunks} chunks
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {source.type.toUpperCase()}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{formatRelativeTime(source.createdAt)}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleChat}
              className="h-7 px-2 text-xs text-brand-500 hover:text-brand-600"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
