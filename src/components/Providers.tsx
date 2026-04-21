"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { ThemeSync } from "@/components/ThemeSync";
import { ChatProvider } from "@/lib/chat/ChatContext";
import { ChatWidget } from "@/components/ChatWidget";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 2,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeSync />
      <ChatProvider>
        {children}
        <ChatWidget />
      </ChatProvider>
    </QueryClientProvider>
  );
}
