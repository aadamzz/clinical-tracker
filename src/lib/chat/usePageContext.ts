"use client";

import { useEffect } from "react";
import { useChatContext, type PageContext } from "@/lib/chat/ChatContext";

/**
 * Hook to set the chat widget's page context. Call this in each page
 * component so the AI assistant knows what the user is looking at.
 *
 * Example:
 *   usePageContext({
 *     pageType: "analytics",
 *     pageTitle: "Analytics Dashboard",
 *     data: { topic, phaseData, statusData },
 *     suggestedQuestions: ["What trends do you see?", ...],
 *   });
 */
export function usePageContext(context: PageContext) {
  const { setPageContext } = useChatContext();

  useEffect(() => {
    setPageContext(context);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    context.pageType,
    context.pageTitle,
    // Stringify data for deep comparison to avoid infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(context.data),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(context.suggestedQuestions),
    setPageContext,
  ]);
}
