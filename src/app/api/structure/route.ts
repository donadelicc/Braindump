import { NextRequest, NextResponse } from "next/server";
import { structureText } from "@/lib/structureText";

export async function POST(request: NextRequest) {
  try {
    const { transcription, sessionData } = await request.json();

    if (!transcription || !sessionData) {
      return NextResponse.json(
        { error: "Transcription and session data are required" },
        { status: 400 },
      );
    }

    if (
      !sessionData.name ||
      !sessionData.description ||
      !sessionData.objective
    ) {
      return NextResponse.json(
        { error: "Session data must include name, description, and objective" },
        { status: 400 },
      );
    }

    const structuredOutput = await structureText(transcription, sessionData);

    return NextResponse.json(structuredOutput);
  } catch (error) {
    console.error("Error structuring text:", error);
    return NextResponse.json(
      { error: "Failed to structure text" },
      { status: 500 },
    );
  }
}
