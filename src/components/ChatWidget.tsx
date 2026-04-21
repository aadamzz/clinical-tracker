"use client";

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  Send,
  Loader2,
  X,
  Bot,
  User,
  Trash2,
  Maximize2,
  Minimize2,
  Sparkles,
} from "lucide-react";
import { useChatContext, type ChatMessage } from "@/lib/chat/ChatContext";
import { ChatMarkdown } from "@/components/ChatMarkdown";

/**
 * ChatWidget — Claude-like floating AI assistant available on every page.
 *
 * Context-aware: it receives the current page context (what page the user
 * is on, what data is visible) and uses it to ground AI responses.
 * Supports rich markdown responses with tables, lists, code, and diagrams.
 */
export function ChatWidget() {
  const {
    pageContext,
    messages,
    addMessage,
    clearMessages,
    isOpen,
    setIsOpen,
  } = useChatContext();

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text.trim(),
        timestamp: Date.now(),
      };

      addMessage(userMsg);
      setInput("");
      setIsLoading(true);

      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }

      try {
        const response = await fetch("/api/ai/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: text.trim(),
            pageContext: {
              pageType: pageContext.pageType,
              pageTitle: pageContext.pageTitle,
              data: pageContext.data,
            },
            conversationHistory: messages.slice(-10).map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!response.ok) {
          const err = await response
            .json()
            .catch(() => ({ error: "Unknown error" }));
          throw new Error((err as { error: string }).error);
        }

        const data: { answer: string } = await response.json();

        addMessage({
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.answer,
          timestamp: Date.now(),
        });
      } catch (err) {
        addMessage({
          id: `error-${Date.now()}`,
          role: "assistant",
          content: `Sorry, I couldn't process your question. ${err instanceof Error ? err.message : "Please try again."}`,
          timestamp: Date.now(),
        });
      } finally {
        setIsLoading(false);
      }
    },
    [pageContext, messages, isLoading, addMessage]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleTextareaInput = () => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  };

  // --- Floating button (closed state) ---
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-violet-500/30 active:scale-95"
        aria-label="Open AI assistant"
      >
        <Sparkles className="h-6 w-6" />
      </button>
    );
  }

  // --- Chat panel (open state) ---
  const panelClasses = isExpanded
    ? "fixed inset-4 z-50 sm:inset-6"
    : "fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-3rem)]";

  return (
    <div
      className={`${panelClasses} flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/10 dark:shadow-black/30 overflow-hidden`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/50 dark:to-indigo-950/50 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              AI Assistant
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Context: <span className="font-medium text-violet-600 dark:text-violet-400">{pageContext.pageTitle}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-white transition-colors"
              aria-label="Clear chat"
              title="Clear chat"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-white transition-colors"
            aria-label={isExpanded ? "Minimize" : "Maximize"}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-500 transition-colors"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome message */}
        {messages.length === 0 && (
          <div className="space-y-4">
            {/* AI avatar + greeting */}
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900 dark:to-indigo-900">
                <Bot className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="flex-1 rounded-2xl rounded-tl-md bg-slate-50 dark:bg-slate-800 p-4">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Hi! I&apos;m your AI research assistant. I can see you&apos;re on the{" "}
                  <strong className="text-violet-600 dark:text-violet-400">{pageContext.pageTitle}</strong> page.
                  Ask me anything about what you see here — I can explain data, generate comparisons,
                  create tables, and help you understand clinical trials.
                </p>
              </div>
            </div>

            {/* Suggested questions */}
            <div className="pl-11">
              <p className="mb-2.5 text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Try asking
              </p>
              <div className="flex flex-col gap-1.5">
                {pageContext.suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="group text-left rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-3.5 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:border-violet-300 dark:hover:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-all"
                  >
                    <span className="mr-2 text-violet-400 group-hover:text-violet-600">→</span>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message list */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                msg.role === "user"
                  ? "bg-sky-100 dark:bg-sky-900"
                  : "bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900 dark:to-indigo-900"
              }`}
            >
              {msg.role === "user" ? (
                <User className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              ) : (
                <Bot className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              )}
            </div>

            {/* Content bubble */}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "rounded-tr-md bg-sky-600 text-white"
                  : "rounded-tl-md bg-slate-50 dark:bg-slate-800"
              }`}
            >
              {msg.role === "user" ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
              ) : (
                <ChatMarkdown content={msg.content} />
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900 dark:to-indigo-900">
              <Bot className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            </div>
            <div className="rounded-2xl rounded-tl-md bg-slate-50 dark:bg-slate-800 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
                <span>Thinking…</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area — Claude-style */}
      <div className="border-t border-slate-100 dark:border-slate-800 p-3">
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 focus-within:border-violet-400 dark:focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-400/20 transition-colors"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onInput={handleTextareaInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask about what you see on this page…"
            rows={1}
            className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white transition-all hover:bg-violet-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <p className="mt-1.5 px-1 text-[10px] text-slate-400 dark:text-slate-500">
          AI responses are context-aware. Press Shift+Enter for new line.
        </p>
      </div>
    </div>
  );
}
