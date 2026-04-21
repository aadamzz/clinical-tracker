"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export interface PageContext {
  /** Which page/tab the user is currently on */
  pageType: "search" | "analytics" | "compare" | "favorites" | "trial-detail";
  /** Human-readable page title */
  pageTitle: string;
  /** Structured data about what's currently visible on the page */
  data: Record<string, unknown>;
  /** Suggested questions relevant to this page */
  suggestedQuestions: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface ChatContextValue {
  /** Current page context for the AI */
  pageContext: PageContext;
  /** Update the page context (called by each page) */
  setPageContext: (ctx: PageContext) => void;
  /** Chat messages history */
  messages: ChatMessage[];
  /** Add a message */
  addMessage: (msg: ChatMessage) => void;
  /** Clear chat history */
  clearMessages: () => void;
  /** Is the chat widget open? */
  isOpen: boolean;
  /** Toggle chat open/close */
  setIsOpen: (open: boolean) => void;
}

const DEFAULT_CONTEXT: PageContext = {
  pageType: "search",
  pageTitle: "Search",
  data: {},
  suggestedQuestions: [
    "What are the most common clinical trial phases?",
    "How do I find trials for a specific condition?",
    "What does 'recruiting' status mean?",
  ],
};

const ChatCtx = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [pageContext, setPageContext] = useState<PageContext>(DEFAULT_CONTEXT);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <ChatCtx.Provider
      value={{
        pageContext,
        setPageContext,
        messages,
        addMessage,
        clearMessages,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </ChatCtx.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatCtx);
  if (!ctx) throw new Error("useChatContext must be used within ChatProvider");
  return ctx;
}
