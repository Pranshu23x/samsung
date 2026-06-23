// POST /api/transcribe
// Accepts a WAV audio blob (form-data field "audio") plus
// the target passage (field "passage") and returns an STT transcript.
// Uses Sarvam AI's speech-to-text API.

import { NextResponse } from "next/server";

const SARVAM_URL = "https://api.sarvam.ai/speech-to-text";

export async function POST(request: Request) {
  const formData = await request.formData();
  const audioFile = formData.get("audio") as File | null;
  const passage = formData.get("passage") as string | null;

  if (!audioFile) {
    return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
  }

  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "SARVAM_API_KEY not configured" }, { status: 500 });
  }

  try {
    const sarvamForm = new FormData();
    sarvamForm.append("file", audioFile);
    sarvamForm.append("language_code", "en-IN");
    sarvamForm.append("model", "saarika:v2.5");
    sarvamForm.append("num_speakers", "1");

    const response = await fetch(SARVAM_URL, {
      method: "POST",
      headers: { "api-subscription-key": apiKey },
      body: sarvamForm,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Sarvam STT error:", response.status, errText);
      return NextResponse.json(
        { error: `STT service returned ${response.status}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const transcript: string =
      data?.transcript || data?.text || data?.transcription || "";

    return NextResponse.json({ transcript, passage });
  } catch (err) {
    console.error("Sarvam STT fetch error:", err);
    return NextResponse.json(
      { error: "Failed to reach STT service" },
      { status: 502 }
    );
  }
}
