"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Paperclip, Square, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChatStore } from "@/store/chatStore";
import { useProjectStore } from "@/store/projectStore";
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
    setSession,
    loadHistory,
    upsertSession,
    currentSessionId,
  } = useChatStore();

  const project_id = useProjectStore((s) => s.currentproject_id);
  const streamingEnabled = useUIStore((state) => state.streamingEnabled);
  const model = useUIStore((state) => state.model);

  const messagesEndRef = useAutoScroll<HTMLDivElement>([messages]);

  // Auto-resize the textarea as the user types.
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200,
      )}px`;
    }
  }, [input]);

  // If we land on the chat page with a saved sessionId (persisted from
  // a previous visit) but no in-memory messages, fetch history. This
  // makes the chat thread survive a page refresh.
  useEffect(() => {
    if (!currentSessionId) return;
    if (messages.length > 0) return;
    let cancelled = false;
    (async () => {
      try {
        const history = await chatService.getMessages(currentSessionId);
        if (cancelled) return;
        loadHistory(currentSessionId, history);
      } catch (err) {
        console.warn("Failed to load chat history", err);
      }
    })();
    return () => {
      cancelled = true;
    };
    // We intentionally only re-run when the session id changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSessionId]);

  // Reset the local session when the project switches — the previous
  // session belongs to the old project, so the next message would
  // 403/404 otherwise.
  useEffect(() => {
    setSession(null);
  }, [project_id, setSession]);

  const ensureSession = async (): Promise<string | null> => {
    if (currentSessionId) return currentSessionId;
    if (!project_id) {
      toast.error("Pick or create a project first.");
      return null;
    }
    try {
      const session = await chatService.createChatSession(project_id);
      setSession(session.id);
      upsertSession({
        id: session.id,
        project_id: session.project_id,
        title: session.title ?? null,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      });
      return session.id;
    } catch (err) {
      console.error("Failed to create chat session", err);
      toast.error("Couldn't start a chat session.");
      return null;
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const question = input.trim();
    setInput("");

    const sessionId = await ensureSession();
    if (!sessionId) return;

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
    messageId: string,
  ) => {
    abortControllerRef.current = new AbortController();

    console.log("called stream response")

    await chatService.streamChat(
      { sessionId, question, model },
      {
        onChunk: (chunk) => appendToMessage(messageId, chunk),
        onComplete: () => updateMessage(messageId, { isStreaming: false }),
        onError: (err) => {
          if (err.name !== "AbortError") throw err;
        },
      },
      abortControllerRef.current.signal,
    );

    if (abortControllerRef.current?.signal.aborted) {
      updateMessage(messageId, { isStreaming: false });
    }
  };

  const nonStreamResponse = async (
    question: string,
    sessionId: string,
    messageId: string,
  ) => {
    const response = await chatService.chat({
      sessionId,
      question,
      model,
      
    });
    updateMessage(messageId, {
      content: response.answer,
      sources: response.sources.map((s) => ({
        id: s.id,
        chunkId: s.chunkId,
        file: s.file,
        path: s.path,
        excerpt: s.excerpt,
      })),
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
    <div className="flex flex-col overflow-hidden h-[calc(100vh-3.5rem)]">
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
                  : project_id
                    ? "Ask your project anything..."
                    : "Pick or create a project to start chatting..."
              }
              disabled={!project_id}
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
                  disabled={!input.trim() || !project_id}
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
