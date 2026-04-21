import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

interface SummaryRequestBody {
  nctId: string;
  title: string;
  status: string;
  phases: string;
  sponsor: string;
  conditions: string;
  interventions: string;
  enrollmentCount?: number;
  briefSummary?: string;
  eligibilityCriteria?: string;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Anthropic API key is not configured. Please add ANTHROPIC_API_KEY to your .env.local file.",
      },
      { status: 500 }
    );
  }

  try {
    const body: SummaryRequestBody = await request.json();

    const anthropic = new Anthropic({ apiKey });

    const prompt = `You are a medical communication specialist. Given the following clinical trial information, provide a clear, plain-language summary in 3–5 sentences that a patient or caregiver with no medical background could understand.

Focus on:
1. What the study is about (disease/condition and treatment being tested)
2. Who can participate (key eligibility in simple terms)
3. What phase it's in and what that means
4. Current status

Study Information:
- Title: ${body.title}
- NCT ID: ${body.nctId}
- Status: ${body.status}
- Phase: ${body.phases}
- Sponsor: ${body.sponsor}
- Conditions: ${body.conditions}
- Interventions: ${body.interventions}
- Enrollment: ${body.enrollmentCount ?? "Not specified"} participants
${body.briefSummary ? `- Brief Summary: ${body.briefSummary}` : ""}
${body.eligibilityCriteria ? `- Eligibility: ${body.eligibilityCriteria.substring(0, 1000)}` : ""}

Write the summary in plain English. Avoid medical jargon. Do not use markdown formatting — just plain text paragraphs.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    const summary = textBlock ? textBlock.text : "Unable to generate summary.";

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("AI Summary error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { error: `Failed to generate AI summary: ${errorMessage}` },
      { status: 500 }
    );
  }
}
