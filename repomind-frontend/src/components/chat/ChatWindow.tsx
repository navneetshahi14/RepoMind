"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, Square, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChatStore } from "@/store/chatStore";
import { useUIStore } from "@/store/uiStore";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { MessageBubble } from "./MessageBubble";
import { ChatWelcome } from "./ChatWelcome";
import { chatService } from "@/services/chatService";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export function ChatWindow() {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    messages,
    addMessage,
    updateMessage,
    appendToMessage,
    setStreamingMessage,
    setIsStreaming,
    isStreaming,
    streamingMessageId,
    activeSource,
    startSession,
    currentSession,
  } = useChatStore();

  const streamingEnabled = useUIStore((state) => state.streamingEnabled);
  const showSources = useUIStore((state) => state.showSources);
  const model = useUIStore((state) => state.model);

  const messagesEndRef = useAutoScroll<HTMLDivElement>([messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const question = input.trim();
    setInput("");

    let sessionId = currentSession;
    if (!sessionId) {
      sessionId = startSession();
    }

    const userMessageId = addMessage({
      role: "user",
      content: question,
    });

    const assistantMessageId = addMessage({
      role: "assistant",
      content: "",
      isStreaming: true,
      model,
    });

    setStreamingMessage(assistantMessageId);
    setIsStreaming(true);

    try {
      if (streamingEnabled) {
        await streamResponse(question, sessionId, assistantMessageId);
      } else {
        await nonStreamResponse(question, sessionId, assistantMessageId);
      }
    } catch (error) {
      const err = error as Error;
      updateMessage(assistantMessageId, {
        content: `Sorry, an error occurred: ${err.message}`,
        isStreaming: false,
      });
      toast.error("Failed to get response");
    } finally {
      setIsStreaming(false);
      setStreamingMessage(null);
    }
  };

  const streamResponse = async (
    question: string,
    sessionId: string,
    messageId: string
  ) => {
    abortControllerRef.current = new AbortController();

    if (!activeSource) {
      updateMessage(messageId, {
        content: "Please select a source first.",
        isStreaming: false,
      });
      return;
    }

    const request: any = {
      question,
      session_id: sessionId,
    };

    if (activeSource.type === "pdf") {
      request.document_id = activeSource.id;
    } else {
      request.repo_id = activeSource.id;
      request.source_id = activeSource.id;
      request.source_type = activeSource.type;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/chat/stream`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        appendToMessage(messageId, chunk);
      }

      updateMessage(messageId, { isStreaming: false });
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        updateMessage(messageId, { isStreaming: false });
      } else {
        throw error;
      }
    }
  };

  const nonStreamResponse = async (
    question: string,
    sessionId: string,
    messageId: string
  ) => {
    if (!activeSource) {
      updateMessage(messageId, {
        content: "Please select a source first.",
        isStreaming: false,
      });
      return;
    }

    console.log(activeSource)
    let response;
    if (activeSource.type === "pdf") {
      alert("pdf")
      response = await chatService.chatWithPDF({
        question,
        document_id: activeSource.id,
        session_id: sessionId,
      });
    } else {
      alert("repo")
      response = await chatService.chatWithRepo({
        question,
        repo_id: activeSource.id,
        session_id: sessionId,
        source_id: activeSource.id,
        source_type: activeSource.type,
      });
    }

    updateMessage(messageId, {
      content: response.answer,
      sources: response.sources,
      isStreaming: false,
    });
  };

  const stopStream = () => {
    abortControllerRef.current?.abort();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleRegenerate = async (messageIndex: number) => {
    const previousUserMessage = messages[messageIndex - 1];
    if (previousUserMessage && previousUserMessage.role === "user") {
      setInput(previousUserMessage.content);
      setTimeout(sendMessage, 0);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div
        className="flex-1 overflow-y-auto scrollbar-thin"
        ref={messagesEndRef}
      >
        {messages.length === 0 ? (
          <ChatWelcome />
        ) : (
          <div className="max-w-3xl mx-auto pb-32">
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                onRegenerate={() =>
                  message.role === "assistant" && handleRegenerate(index)
                }
              />
            ))}
            {isStreaming && streamingMessageId && (
              <div className="px-4 py-2 text-xs text-muted-foreground flex items-center gap-2 max-w-3xl mx-auto">
                <Spinner size="sm" />
                <span>Generating response...</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-border/50 bg-background/80 backdrop-blur-xl p-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl border border-border bg-card shadow-lg focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500/50 transition-all">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                activeSource
                  ? `Ask ${activeSource.name} anything...`
                  : "Select a source to start chatting..."
              }
              disabled={!activeSource}
              className="min-h-[52px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-3 pr-24"
              rows={1}
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Paperclip className="h-4 w-4" />
              </Button>
              {isStreaming ? (
                <Button
                  onClick={stopStream}
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Square className="h-3 w-3 fill-current" />
                </Button>
              ) : (
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || !activeSource}
                  size="icon"
                  className="h-8 w-8"
                  variant="gradient"
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            RepoMind can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
