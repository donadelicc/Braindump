import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/transcribe";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 },
      );
    }

    // Use the transcribeAudio function which will console log the full object
    const transcriptionObject = await transcribeAudio(audioFile);

    return NextResponse.json({
      transcription: transcriptionObject.text,
      success: true,
    });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      {
        error: "Failed to transcribe audio",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
