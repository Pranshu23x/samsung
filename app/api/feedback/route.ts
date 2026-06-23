// POST /api/feedback
// Given a fluency score + error summary, returns a short encouraging line
// from Groq (LLM). This is optional — the fallback just returns static text.

import { NextResponse } from "next/server";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

type FeedbackRequest = {
  accuracy: number;
  wcpm: number;
  errors: { word: string; status: string }[];
};

export async function POST(request: Request) {
  const body: FeedbackRequest = await request.json();
  const { accuracy, wcpm, errors } = body;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: fallback(accuracy) });
  }

  const errorList =
    errors.length > 0
      ? errors.map((e) => `"${e.word}" (${e.status})`).join(", ")
      : "no errors";

  const prompt = `A child just read a passage aloud with ${accuracy}% accuracy at ${wcpm} words per minute. ${errors.length > 0 ? `They stumbled on: ${errorList}.` : "They read perfectly."} Give ONE short, encouraging sentence in Indian English (like a friendly tutor). No markdown, no quotes.`;

  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 60,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error("Groq error:", await response.text());
      return NextResponse.json({ message: fallback(accuracy) });
    }

    const data = await response.json();
    const message: string =
      data?.choices?.[0]?.message?.content?.trim() || fallback(accuracy);
    return NextResponse.json({ message });
  } catch {
    return NextResponse.json({ message: fallback(accuracy) });
  }
}

function fallback(accuracy: number): string {
  if (accuracy >= 95) return "Brilliant reading! You made it look easy.";
  if (accuracy >= 80) return "Great job! Keep practicing and you'll get even better.";
  if (accuracy >= 60) return "Good try! Let's read it once more.";
  return "Nice effort! Every time you try, you improve.";
}
