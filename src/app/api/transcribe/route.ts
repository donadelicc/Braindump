import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/transcribe";
import { del } from "@vercel/blob";

export const maxDuration = 300; // 5 minutes for processing long audio files

export async function POST(request: NextRequest) {
  try {
    // Check if we're receiving a blob URL or a file
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      // Handle blob URL
      const { audioUrl } = await request.json();

      if (!audioUrl) {
        return NextResponse.json(
          { error: "No audio URL provided" },
          { status: 400 },
        );
      }

      console.log('Fetching audio from blob URL:', audioUrl);

      // Fetch the audio file from the blob URL
      const response = await fetch(audioUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch audio file: ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const audioFile = new File([audioBuffer], 'audio.webm', { 
        type: 'audio/webm' 
      });

      console.log('Audio file size:', audioBuffer.byteLength, 'bytes');

      const transcriptionObject = await transcribeAudio(audioFile);

      // Clean up the blob after successful transcription
      try {
        await del(audioUrl);
        console.log('Successfully deleted blob after transcription');
      } catch (deleteError) {
        console.warn('Failed to delete blob after transcription:', deleteError);
        // Don't fail the request if cleanup fails
      }

      return NextResponse.json({
        transcription: transcriptionObject.text,
        success: true,
      });
    } else {
      // Handle legacy FormData uploads (keep for backward compatibility)
      const formData = await request.formData();
      const audioFile = formData.get("audio") as File;

      if (!audioFile) {
        return NextResponse.json(
          { error: "No audio file provided" },
          { status: 400 },
        );
      }

      console.log('Processing direct file upload (legacy):', audioFile.size, 'bytes');

      const transcriptionObject = await transcribeAudio(audioFile);

      return NextResponse.json({
        transcription: transcriptionObject.text,
        success: true,
      });
    }
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
