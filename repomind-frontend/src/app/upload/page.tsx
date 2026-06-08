"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, FileType, FileCode, Github } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UploadDropzone } from "@/components/upload/UploadDropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github as GithubIcon, GitBranch, Loader2, Lock } from "lucide-react";
import { githubService } from "@/services/githubService";
import { uploadService } from "@/services/uploadService";
import { useSourceStore } from "@/store/sourceStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UploadPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [cloning, setCloning] = useState(false);
  const addRepo = useSourceStore((state) => state.addRepo);
  const addSource = useSourceStore((state) => state.addSource);
  const router = useRouter();

  const handleRepoClone = async () => {
    if (!repoUrl.trim()) {
      toast.error("Please enter a GitHub URL");
      return;
    }

    setCloning(true);
    try {
      const result = await githubService.uploadRepo(repoUrl);
      addRepo({
        id: result.repo_id,
        name: repoUrl.split("/").pop()?.replace(".git", "") || "Repository",
        url: repoUrl,
        files: result.files,
        chunks: result.chunks,
        status: "ready",
        createdAt: new Date().toISOString(),
      });
      toast.success("Repository indexed successfully!");
      setRepoUrl("");
      router.push("/github");
    } catch (error) {
      toast.error("Failed to clone repository");
    } finally {
      setCloning(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const result = await uploadService.uploadPDF(file);
      addSource({
        id: result.document_id,
        name: result.filename,
        type: "pdf",
        chunks: result.chunks,
        createdAt: new Date().toISOString(),
      });
      toast.success(`${file.name} uploaded!`);
      return result;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Upload Knowledge Sources
          </h1>
          <p className="text-muted-foreground mt-1">
            Add PDFs, GitHub repositories, or documents to start chatting.
          </p>
        </motion.div>

        <Tabs defaultValue="pdf" className="">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="pdf">PDF</TabsTrigger>
            {/* <TabsTrigger value="markdown">MD</TabsTrigger>
            <TabsTrigger value="text">TXT</TabsTrigger> */}
            <TabsTrigger value="github">GitHub</TabsTrigger>
          </TabsList>

          <TabsContent value="pdf" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-red-500" />
                  Upload PDF Document
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UploadDropzone
                  accept={{ "application/pdf": [".pdf"] }}
                  uploadFn={handleFileUpload}
                  title="Drop your PDF here"
                  description="PDF files up to 50MB"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="markdown" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileType className="h-4 w-4 text-blue-500" />
                  Upload Markdown File
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UploadDropzone
                  accept={{
                    "text/markdown": [".md", ".markdown"],
                  }}
                  uploadFn={uploadService.uploadMarkdown}
                  title="Drop your markdown file"
                  description=".md or .markdown files"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-emerald-500" />
                  Upload Text File
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UploadDropzone
                  accept={{ "text/plain": [".txt"] }}
                  uploadFn={uploadService.uploadText}
                  title="Drop your text file"
                  description=".txt files up to 50MB"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="github" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <GithubIcon className="h-4 w-4 text-purple-500" />
                  Clone GitHub Repository
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="https://github.com/user/repo"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleRepoClone()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleRepoClone}
                    disabled={cloning || !repoUrl.trim()}
                    variant="gradient"
                  >
                    {cloning ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cloning...
                      </>
                    ) : (
                      <>
                        <GitBranch className="h-4 w-4" />
                        Clone & Index
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Card className="bg-muted/30">
                    <CardContent className="p-3 text-center space-y-1">
                      <FileText className="h-5 w-5 mx-auto text-muted-foreground" />
                      <p className="text-xs font-medium">.py, .js, .ts</p>
                      <p className="text-[10px] text-muted-foreground">
                        Code files
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/30">
                    <CardContent className="p-3 text-center space-y-1">
                      <FileType className="h-5 w-5 mx-auto text-muted-foreground" />
                      <p className="text-xs font-medium">.md, .markdown</p>
                      <p className="text-[10px] text-muted-foreground">
                        Documentation
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/30">
                    <CardContent className="p-3 text-center space-y-1">
                      <FileCode className="h-5 w-5 mx-auto text-muted-foreground" />
                      <p className="text-xs font-medium">.txt</p>
                      <p className="text-[10px] text-muted-foreground">
                        Text files
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Lock className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Only public repositories are supported. Make sure the URL is
                    valid and accessible.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
