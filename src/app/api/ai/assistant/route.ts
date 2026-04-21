import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

interface AssistantRequestBody {
  question: string;
  pageContext: {
    pageType: string;
    pageTitle: string;
    data: Record<string, unknown>;
  };
  conversationHistory: { role: "user" | "assistant"; content: string }[];
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Anthropic API key is not configured." },
      { status: 500 }
    );
  }

  try {
    const body: AssistantRequestBody = await request.json();
    const anthropic = new Anthropic({ apiKey });
    const ctx = body.pageContext;

    // Build context-specific system prompt
    const dataContext = JSON.stringify(ctx.data, null, 2).substring(0, 6000);

    const systemPrompt = `You are an expert AI research assistant embedded in a Clinical Trial Tracker web application. You help users understand clinical trials, analyze data, and make sense of medical research.

## Current Context
The user is currently on the **${ctx.pageTitle}** page (type: ${ctx.pageType}).

Here is the data currently visible on their page:
\`\`\`json
${dataContext}
\`\`\`

## Your Capabilities
1. **Explain** clinical trial concepts, phases, statuses, and terminology in plain language
2. **Analyze** the data visible on the current page — identify trends, patterns, insights
3. **Compare** trials side-by-side when given comparison data
4. **Generate tables** (in markdown) for structured comparisons and summaries
5. **Generate interactive charts** using the chart block syntax (see below)
6. **Summarize** complex medical information for patients and caregivers

## Chart Generation
You can generate interactive charts by using a special fenced code block with language "chart" containing a JSON specification. The chart will be rendered as an interactive Recharts component.

**Format:**
\`\`\`chart
{"type":"pie","title":"Chart Title","data":[{"name":"Label","value":123}]}
\`\`\`

**Supported chart types:**
- \`pie\` — pie chart (good for distributions, proportions)
- \`donut\` — donut chart (like pie but with hole in center)
- \`bar\` — vertical bar chart (good for comparing values)
- \`horizontal-bar\` — horizontal bar chart (good for rankings, long labels)
- \`line\` — line chart (good for trends over time)
- \`radar\` — radar/spider chart (good for multi-dimensional comparison)

**Data format:** Each item needs \`name\` (string) and \`value\` (number). Optional: \`color\` (hex string).

**IMPORTANT chart rules:**
- The JSON must be valid and on a SINGLE line or properly formatted
- Always include a descriptive \`title\`
- Use charts when the user asks about distributions, comparisons, trends, or breakdowns
- You can include MULTIPLE charts in a single response
- Combine charts with explanatory text above/below them
- Keep data items to 3-10 for readability

**Example response with chart:**
Here's the phase distribution:

\`\`\`chart
{"type":"donut","title":"Trial Phases","data":[{"name":"Phase 1","value":15,"color":"#eab308"},{"name":"Phase 2","value":30,"color":"#f97316"},{"name":"Phase 3","value":25,"color":"#10b981"},{"name":"Phase 4","value":10,"color":"#0ea5e9"}]}
\`\`\`

Phase 2 trials dominate with 30 studies (37.5%).

## Response Guidelines
- Use **Markdown** formatting: headers, bold, tables, lists, code blocks
- When asked to compare, ALWAYS generate a markdown table
- When asked about distributions or data visualization, ALWAYS generate a chart block
- When asked about data/trends, reference the specific data from the page context
- Keep responses focused and concise (3-8 sentences for simple questions, more for analysis)
- Use bullet points for listing multiple items
- If asked about something not in the page context, say so and suggest how they can find it
- For medical questions, always add a brief disclaimer that users should consult healthcare providers
- Be warm and professional — like a knowledgeable research colleague
- When generating charts alongside tables, put the chart first for visual impact

## Page-Specific Behavior
${getPageSpecificInstructions(ctx.pageType)}`;

    const messages: Anthropic.MessageParam[] = [
      ...body.conversationHistory.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content: body.question },
    ];

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: systemPrompt,
      messages,
    });

    const textBlock = message.content.find((block) => block.type === "text");
    const answer = textBlock ? textBlock.text : "Unable to answer.";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("AI Assistant error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to process question: ${errorMessage}` },
      { status: 500 }
    );
  }
}

function getPageSpecificInstructions(pageType: string): string {
  switch (pageType) {
    case "search":
      return `The user is on the SEARCH page. They may have search results visible.
- Help them refine their search queries
- Explain what different filters mean
- If they have results, analyze the visible trials
- Suggest related search terms`;

    case "analytics":
      return `The user is on the ANALYTICS DASHBOARD with charts and statistics.
- Analyze the phase distribution, status breakdown, sponsor data, and intervention types
- Identify trends and notable patterns in the data
- When generating comparisons, use markdown tables
- Reference specific numbers from the chart data provided`;

    case "compare":
      return `The user is on the COMPARE page with trials side-by-side.
- Help them understand differences between the compared trials
- Generate comparative tables highlighting key differences
- Point out which trial might be more relevant based on specific criteria
- Explain what the differences mean practically`;

    case "favorites":
      return `The user is on the FAVORITES page with their saved trials.
- Help them organize and understand their saved trials
- Suggest which ones might be most relevant for their interests
- Offer to compare any of their saved trials
- Summarize commonalities across saved trials`;

    case "trial-detail":
      return `The user is viewing a SPECIFIC TRIAL's detail page.
- Answer questions about this specific trial's eligibility, interventions, outcomes
- Explain medical terminology found in the trial description
- Help them understand if this trial might be relevant
- Explain the phase timeline and what it means for this trial`;

    default:
      return `Help the user understand clinical trials and the data on this page.`;
  }
}
