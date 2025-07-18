"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import StepIndicator from "@/components/StepIndicator";
import SessionSetup from "@/components/SessionSetup";
import TranscribedText from "@/components/TranscribedText";
import StructuredOutput from "@/components/StructuredOutput";
import { useAuth } from "@/contexts/AuthContext";
import { sessionService } from "@/lib/sessionService";
import type { AudioInputRef } from "@/components/AudioInput";

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
  keyTakeaways?: string[]; // Make this optional since it's not being generated by the AI
}

export default function BrainDump() {
  const { user, loading } = useAuth();
  const router = useRouter();
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
  const audioInputRef = useRef<AudioInputRef>(null);

  // Authentication check
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

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
      setCurrentStep(3); // Step 3: Show transcription result
    }
  };

  const handleAudioReady = (audioReady: boolean) => {
    setHasAudio(audioReady);
  };

  const handleTranscribeAndProceed = async () => {
    if (audioInputRef.current) {
      await audioInputRef.current.handleTranscribe();
    }
  };

  const handleGenerateStructuredOutput = async () => {
    if (!transcription || !sessionData) return;

    setIsStructuring(true);
    setStructuringError("");
    setCurrentStep(4); // Move to step 4

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

  const handleSaveSession = async (
    sessionData: SessionData,
    structuredOutput: BrainstormingOutput,
  ) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    await sessionService.saveSession(
      user.uid,
      sessionData,
      structuredOutput,
      transcription,
    );
  };

  const handleStepNavigation = (step: number) => {
    // Allow navigation to previous steps if they have been completed
    if (step === 1) {
      setCurrentStep(1);
    } else if (step === 2 && sessionData) {
      setCurrentStep(2);
    } else if (step === 3 && transcription) {
      setCurrentStep(3);
    } else if (step === 4 && structuredOutput) {
      setCurrentStep(4);
    }
  };

  const renderNavigationButtons = () => {
    const buttons = [];

    // Back button (except for step 1)
    if (currentStep > 1) {
      buttons.push(
        <button
          key="back"
          onClick={() => handleStepNavigation(currentStep - 1)}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          ← Tilbake
        </button>,
      );
    }

    // Step-specific forward buttons
    if (currentStep === 2 && hasAudio) {
      buttons.push(
        <button
          key="transcribe"
          onClick={handleTranscribeAndProceed}
          disabled={isTranscribing}
          className={`px-4 py-2 text-white rounded-lg font-medium transition-colors ${
            isTranscribing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isTranscribing ? "Transkriberer..." : "Transkriber"}
        </button>,
      );
    }

    if (currentStep === 3 && transcription && !isTranscribing) {
      buttons.push(
        <button
          key="structure"
          onClick={handleGenerateStructuredOutput}
          disabled={isStructuring}
          className={`px-4 py-2 text-white rounded-lg font-medium transition-colors ${
            isStructuring
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isStructuring ? "Strukturerer..." : "Generer strukturert utgang"}
        </button>,
      );
    }

    return buttons.length > 0 ? (
      <div className="flex justify-between items-center mt-6">
        <div className="flex gap-2">{buttons}</div>
      </div>
    ) : null;
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (redirect is in progress)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="min-h-screen bg-gray-100 py-8 w-full">
        <div className="max-w-6xl mx-auto space-y-6">
          <StepIndicator currentStep={currentStep} />

          {/* Step 1: Session Setup */}
          {currentStep === 1 && (
            <SessionSetup onSessionComplete={handleSessionComplete} />
          )}

          {/* Step 2: Audio Input */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <AudioInput
                ref={audioInputRef}
                onTranscriptionChange={handleTranscriptionChange}
                onAudioReady={handleAudioReady}
                hideTranscribeButton={true}
              />
              {renderNavigationButtons()}
            </div>
          )}

          {/* Step 3: Transcription Results */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <TranscribedText
                transcription={transcription}
                isTranscribing={isTranscribing}
                error={transcriptionError}
              />
              {renderNavigationButtons()}
            </div>
          )}

          {/* Step 4: Structured Output */}
          {currentStep === 4 && (
            <div className="space-y-4">
              {/* Loading state */}
              {isStructuring && (
                <div className="w-full bg-white rounded-lg shadow-lg p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                    <span className="ml-3 text-blue-600 font-medium">
                      Genererer strukturert utgang...
                    </span>
                  </div>
                </div>
              )}

              {/* Error state */}
              {structuringError && !isStructuring && (
                <div className="w-full bg-white rounded-lg shadow-lg p-6">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h3 className="font-medium text-red-800 mb-2">
                      Struktureringsfeil:
                    </h3>
                    <p className="text-red-700 text-sm">{structuringError}</p>
                    <button
                      onClick={handleGenerateStructuredOutput}
                      className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                    >
                      Prøv igjen
                    </button>
                  </div>
                </div>
              )}

              {/* Structured Output Component */}
              {structuredOutput && sessionData && (
                <StructuredOutput
                  data={structuredOutput}
                  sessionData={sessionData}
                  onSave={handleSaveSession}
                />
              )}

              {renderNavigationButtons()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
