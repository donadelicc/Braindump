import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function transcribeAudio(
  audioFile: File,
): Promise<OpenAI.Audio.Transcription> {
  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
    language: "no", // Norwegian language support
    temperature: 0.0,
    prompt:
      "This is a Norwegian language audio recording. Please transcribe it in Norwegian.",
  });

  // Console log the entire transcription object
  console.log("Full transcription object:", transcription);

  return transcription;
}
