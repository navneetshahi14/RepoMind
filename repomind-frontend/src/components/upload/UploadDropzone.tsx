"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Cloud,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn, formatBytes } from "@/lib/utils";
import { uploadService } from "@/services/uploadService";
import { useUIStore } from "@/store/uiStore";
import { toast } from "sonner";
import type { UploadProgress } from "@/types";

interface UploadDropzoneProps {
  accept?: Record<string, string[]>;
  maxSize?: number;
  multiple?: boolean;
  onUploadComplete?: (result: any) => void;
  uploadFn?: (file: File, onProgress: (n: number) => void) => Promise<any>;
  title?: string;
  description?: string;
}

export function UploadDropzone({
  accept = {
    "application/pdf": [".pdf"],
    "text/markdown": [".md", ".markdown"],
    "text/plain": [".txt"],
  },
  maxSize = 50 * 1024 * 1024,
  multiple = true,
  onUploadComplete,
  uploadFn = uploadService.uploadPDF,
  title = "Drop files here or click to upload",
  description = "PDF, Markdown, or TXT files up to 50MB",
}: UploadDropzoneProps) {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setUploading = useUIStore((state) => state.setUploading);

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejections: FileRejection[]) => {
      if (rejections.length > 0) {
        rejections.forEach((rejection) => {
          toast.error(`${rejection.file.name}: ${rejection.errors[0]?.message}`);
        });
      }

      if (acceptedFiles.length === 0) return;

      setUploading(true);

      for (const file of acceptedFiles) {
        const newUpload: UploadProgress = {
          file: file.name,
          progress: 0,
          status: "uploading",
        };
        setUploads((prev) => [newUpload, ...prev]);

        try {
          const result = await uploadFn(file, (progress) => {
            setUploads((prev) =>
              prev.map((u) =>
                u.file === file.name && u.status === "uploading"
                  ? { ...u, progress }
                  : u
              )
            );
          });

          setUploads((prev) =>
            prev.map((u) =>
              u.file === file.name
                ? { ...u, progress: 100, status: "complete" }
                : u
            )
          );

          toast.success(`${file.name} uploaded successfully`);
          onUploadComplete?.(result);
        } catch (error) {
          setUploads((prev) =>
            prev.map((u) =>
              u.file === file.name
                ? { ...u, status: "error", error: (error as Error).message }
                : u
            )
          );
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      setUploading(false);
    },
    [uploadFn, onUploadComplete, setUploading]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept,
      maxSize,
      multiple,
    });

  const removeUpload = (file: string) => {
    setUploads((prev) => prev.filter((u) => u.file !== file));
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative cursor-pointer rounded-2xl border-2 border-dashed transition-all p-8 md:p-12 text-center",
          isDragActive && !isDragReject
            ? "border-brand-500 bg-brand-500/5"
            : isDragReject
            ? "border-destructive bg-destructive/5"
            : "border-border hover:border-brand-500/50 hover:bg-muted/30"
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{
              scale: isDragActive ? 1.1 : 1,
              rotate: isDragActive ? 5 : 0,
            }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-brand-600 blur-2xl opacity-30" />
            <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-400/20 to-brand-600/20 flex items-center justify-center">
              <Upload className="h-8 w-8 text-brand-500" />
            </div>
          </motion.div>

          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          <Button variant="outline" size="sm" type="button">
            <Cloud className="h-4 w-4 mr-2" />
            Browse Files
          </Button>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {uploads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {uploads.map((upload, idx) => (
              <motion.div
                key={upload.file}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center",
                          upload.status === "complete"
                            ? "bg-emerald-500/10"
                            : upload.status === "error"
                            ? "bg-destructive/10"
                            : "bg-brand-500/10"
                        )}
                      >
                        {upload.status === "complete" ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : upload.status === "error" ? (
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        ) : (
                          <FileText className="h-5 w-5 text-brand-500" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="text-sm font-medium truncate">
                            {upload.file}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {upload.status === "complete"
                              ? "Complete"
                              : upload.status === "error"
                              ? "Failed"
                              : `${upload.progress}%`}
                          </span>
                        </div>
                        <Progress
                          value={upload.progress}
                          className={cn(
                            "h-1.5",
                            upload.status === "error" && "opacity-50"
                          )}
                        />
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeUpload(upload.file)}
                        className="h-8 w-8 flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
