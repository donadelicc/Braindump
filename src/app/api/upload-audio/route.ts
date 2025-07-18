import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onBeforeGenerateToken: async (pathname: string) => {
        // Here you could add authentication if needed
        // For now, we'll allow all uploads but restrict file types

        return {
          allowedContentTypes: [
            "audio/wav",
            "audio/mp3",
            "audio/mpeg",
            "audio/webm",
            "audio/m4a",
            "audio/ogg",
            "audio/flac",
            "audio/aac",
          ],
          maximumSizeInBytes: 50 * 1024 * 1024, // 50MB limit
          validUntil: Date.now() + 1000 * 60 * 10, // 10 minutes
          tokenPayload: JSON.stringify({
            // Optional metadata
            uploadedAt: new Date().toISOString(),
            purpose: "transcription",
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("Audio upload completed:", {
          url: blob.url,
          pathname: blob.pathname,
          tokenPayload,
        });

        // Here you could save the blob info to a database if needed
        // For now, we'll just log it
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}
