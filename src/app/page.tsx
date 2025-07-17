"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import StepIndicator from "@/components/StepIndicator";
import SessionSetup from "@/components/SessionSetup";
import TranscribedText from "@/components/TranscribedText";
import StructuredOutput from "@/components/StructuredOutput";

// Dynamically import AudioInput with SSR disabled
const AudioInput = dynamic(() => import("@/components/AudioInput"), {
  ssr: false,
});

interface SessionData {
  name: string;
  description: string;
  objective: string;
}

interface CategoryOutput {
  title: string;
  description: string;
  insights: string[];
}

interface BrainstormingOutput {
  summary: string;
  categories: CategoryOutput[];
  keyTakeaways: string[];
}

export default function Home() {
  const [transcription, setTranscription] = useState<string>("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(1);
  const [hasAudio, setHasAudio] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [structuredOutput, setStructuredOutput] =
    useState<BrainstormingOutput | null>(null);
  const [isStructuring, setIsStructuring] = useState(false);
  const [structuringError, setStructuringError] = useState<string>("");

  const handleSessionComplete = (data: SessionData) => {
    setSessionData(data);
    setCurrentStep(2); // Move to step 2: Audio upload/recording
  };

  const handleTranscriptionChange = (
    newTranscription: string,
    isProcessing: boolean,
    error: string,
  ) => {
    setTranscription(newTranscription);
    setIsTranscribing(isProcessing);
    setTranscriptionError(error);

    // Clear structured output when transcription changes
    if (newTranscription !== transcription) {
      setStructuredOutput(null);
      setStructuringError("");
    }

    // Update step based on transcription state
    if (isProcessing) {
      setCurrentStep(3); // Step 3: Getting transcription
    } else if (newTranscription && !error) {
      setCurrentStep(4); // Step 4: Transcription complete, ready for structured output
    }
  };

  const handleAudioReady = (audioReady: boolean) => {
    setHasAudio(audioReady);
    if (!audioReady && sessionData) {
      setCurrentStep(2); // Reset to step 2 if no audio but session is set up
    }
  };

  const handleGenerateStructuredOutput = async () => {
    if (!transcription || !sessionData) return;

    setIsStructuring(true);
    setStructuringError("");

    try {
      const response = await fetch("/api/structure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcription,
          sessionData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate structured output");
      }

      const result = await response.json();
      setStructuredOutput(result);
    } catch (error) {
      console.error("Error generating structured output:", error);
      setStructuringError(
        "Kunne ikke generere strukturert utgang. Prøv igjen.",
      );
    } finally {
      setIsStructuring(false);
    }
  };

  // Reset to appropriate step when everything is cleared
  useEffect(() => {
    if (!transcription && !isTranscribing && !transcriptionError && !hasAudio) {
      if (sessionData) {
        setCurrentStep(2); // Back to audio step if session is set up
      } else {
        setCurrentStep(1); // Back to session setup if no session
      }
    }
  }, [
    transcription,
    isTranscribing,
    transcriptionError,
    hasAudio,
    sessionData,
  ]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-8xl font-bold text-center text-deep-sea mb-8">
        BRAIN DUMP
      </h1>
      <div className="min-h-screen bg-gray-100 py-8 w-full">
        <div className="max-w-6xl mx-auto space-y-6">
          <StepIndicator currentStep={currentStep} />

          {/* Step 1: Session Setup */}
          {currentStep === 1 && (
            <SessionSetup onSessionComplete={handleSessionComplete} />
          )}

          {/* Step 2: Audio Input */}
          {currentStep >= 2 && (
            <AudioInput
              onTranscriptionChange={handleTranscriptionChange}
              onAudioReady={handleAudioReady}
            />
          )}

          {/* Step 3: Transcription Results */}
          {currentStep >= 3 && (
            <TranscribedText
              transcription={transcription}
              isTranscribing={isTranscribing}
              error={transcriptionError}
            />
          )}

          {/* Step 4: Structured Output */}
          {currentStep >= 4 && transcription && sessionData && (
            <div className="w-full space-y-4">
              {/* Generate Button */}
              {!structuredOutput && (
                <div className="w-full bg-white rounded-lg shadow-lg p-6 text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Generer strukturert utgang
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Klikk nedenfor for å analysere transkripsjonen og generere
                    strukturerte innsikter basert på økt-konteksten.
                  </p>
                  <button
                    onClick={handleGenerateStructuredOutput}
                    disabled={isStructuring}
                    className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                      isStructuring
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    {isStructuring
                      ? "Genererer..."
                      : "Generer strukturert utgang"}
                  </button>
                  {structuringError && (
                    <p className="mt-2 text-red-600 text-sm">
                      {structuringError}
                    </p>
                  )}
                </div>
              )}

              {/* Structured Output Component */}
              {structuredOutput && (
                <StructuredOutput
                  data={structuredOutput}
                  sessionData={sessionData}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
