import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { upload } from "@vercel/blob/client";

interface AudioInputProps {
  onTranscriptionChange: (
    transcription: string,
    isTranscribing: boolean,
    error: string,
  ) => void;
  onAudioReady?: (hasAudio: boolean) => void;
  hideTranscribeButton?: boolean;
}

export interface AudioInputRef {
  handleTranscribe: () => Promise<void>;
}

const AudioInput = forwardRef<AudioInputRef, AudioInputProps>(
  (
    { onTranscriptionChange, onAudioReady, hideTranscribeButton = false },
    ref,
  ) => {
    const [activeTab, setActiveTab] = useState<"record" | "upload">("upload");
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Recording state
    const {
      status,
      startRecording,
      stopRecording,
      mediaBlobUrl,
      clearBlobUrl,
    } = useReactMediaRecorder({
      audio: true,
      askPermissionOnMount: true,
    });

    // Notify when recording audio becomes available
    useEffect(() => {
      if (mediaBlobUrl) {
        onAudioReady?.(true);
      }
    }, [mediaBlobUrl, onAudioReady]);

    // Upload state
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setAudioUrl(url);

        // Clear previous transcription
        onTranscriptionChange("", false, "");
        onAudioReady?.(true); // Audio is ready
      }
    };

    const handleClear = () => {
      // Clear recording
      clearBlobUrl();

      // Clear upload
      setSelectedFile(null);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }

      // Clear transcription
      onTranscriptionChange("", false, "");
      onAudioReady?.(false); // No audio available
    };

    const handleTranscribe = async () => {
      let audioToTranscribe: Blob | File | null = null;
      let fileName = "audio.webm";

      if (activeTab === "record" && mediaBlobUrl) {
        const response = await fetch(mediaBlobUrl);
        audioToTranscribe = await response.blob();
        fileName = "recorded-audio.webm";
      } else if (activeTab === "upload" && selectedFile) {
        audioToTranscribe = selectedFile;
        fileName = selectedFile.name;
      }

      if (!audioToTranscribe) return;

      setIsUploading(true);
      setUploadProgress(0);
      onTranscriptionChange("", true, "");

      try {
        // Step 1: Upload to Vercel Blob
        console.log("Uploading audio file to Vercel Blob...");
        const blob = await upload(fileName, audioToTranscribe, {
          access: "public",
          handleUploadUrl: "/api/upload-audio",
          onUploadProgress: (progress) => {
            setUploadProgress(Math.round(progress.percentage));
          },
        });

        console.log("Upload completed, blob URL:", blob.url);
        setIsUploading(false);
        setIsTranscribing(true);

        // Step 2: Transcribe using the blob URL
        const transcribeResponse = await fetch("/api/transcribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ audioUrl: blob.url }),
        });

        const result = await transcribeResponse.json();

        if (result.success) {
          onTranscriptionChange(result.transcription, false, "");
        } else {
          const errorMsg = result.error || "Failed to transcribe audio";
          onTranscriptionChange("", false, errorMsg);
        }
      } catch (error) {
        console.error("Upload/Transcription error:", error);
        let errorMsg = "Failed to process audio. Please try again.";

        if (error instanceof Error) {
          if (error.message.includes("upload")) {
            errorMsg = "Failed to upload audio file. Please try again.";
          } else if (error.message.includes("transcribe")) {
            errorMsg = "Failed to transcribe audio. Please try again.";
          }
        }

        onTranscriptionChange("", false, errorMsg);
      } finally {
        setIsUploading(false);
        setIsTranscribing(false);
        setUploadProgress(0);
      }
    };

    // Expose handleTranscribe through ref
    useImperativeHandle(ref, () => ({
      handleTranscribe,
    }));

    const handleDownload = () => {
      if (mediaBlobUrl) {
        const a = document.createElement("a");
        a.href = mediaBlobUrl;
        a.download = "brainstorm-session.wav";
        a.click();
      }
    };

    const hasAudioToTranscribe = () => {
      return (
        (activeTab === "record" && mediaBlobUrl) ||
        (activeTab === "upload" && selectedFile)
      );
    };

    return (
      <div className="w-full mx-auto p-4 bg-white rounded-lg shadow-lg">
        {/* Horizontal Layout */}
        <div className="flex items-center gap-6">
          {/* Tab Navigation - Left Side */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("record")}
              className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "record"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Ta opp lyd
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "upload"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Last opp fil
            </button>
          </div>

          {/* Content Area - Right Side */}
          <div className="flex-1 flex items-center gap-4">
            {/* Record Tab */}
            {activeTab === "record" && (
              <div className="flex items-center gap-4 flex-wrap">
                {/* Status indicator */}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    status === "recording"
                      ? "bg-red-100 text-red-800"
                      : status === "stopped"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  Status: {status}
                </span>

                {/* Recording controls */}
                {status !== "recording" ? (
                  <button
                    onClick={startRecording}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                  >
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                    Start opptak
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                  >
                    <div className="w-3 h-3 bg-white"></div>
                    Stopp opptak
                  </button>
                )}

                {/* Recording indicator */}
                {status === "recording" && (
                  <div className="flex items-center">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <div
                        className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                    <span className="ml-3 text-red-600 font-medium">
                      Opptak pågår...
                    </span>
                  </div>
                )}

                {/* Playback - if audio exists */}
                {mediaBlobUrl && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Forhåndsvisning:
                    </span>
                    <audio
                      src={mediaBlobUrl}
                      controls
                      className="h-8"
                      preload="metadata"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Upload Tab */}
            {activeTab === "upload" && (
              <div className="flex items-center gap-4 flex-wrap">
                {/* File input */}
                <input
                  type="file"
                  accept="audio/mp3,audio/mpeg,audio/wav,audio/m4a,audio/webm"
                  onChange={handleFileSelect}
                  className="text-sm text-gray-500
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-full file:border-0
                           file:text-sm file:font-semibold
                           file:bg-blue-50 file:text-blue-700
                           hover:file:bg-blue-100"
                />

                {/* Selected file info */}
                {selectedFile && (
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-lg">
                    <span className="text-sm text-gray-600">
                      {selectedFile.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                )}

                {/* Audio preview */}
                {audioUrl && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Forhåndsvisning:
                    </span>
                    <audio
                      src={audioUrl}
                      controls
                      className="h-8"
                      preload="metadata"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          {hasAudioToTranscribe() && !hideTranscribeButton && (
            <div className="flex gap-2 ml-auto">
              <button
                onClick={handleTranscribe}
                disabled={isTranscribing || isUploading}
                className={`px-4 py-2 text-white rounded-lg font-medium transition-colors ${
                  isTranscribing || isUploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {isUploading
                  ? `Laster opp... ${uploadProgress}%`
                  : isTranscribing
                    ? "Transkriberer..."
                    : "Transkriber"}
              </button>

              {activeTab === "record" && (
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  Last ned
                </button>
              )}

              <button
                onClick={handleClear}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Tøm
              </button>
            </div>
          )}

          {/* Clear button when hideTranscribeButton is true */}
          {hasAudioToTranscribe() && hideTranscribeButton && (
            <div className="flex gap-2 ml-auto">
              {activeTab === "record" && (
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  Last ned
                </button>
              )}

              <button
                onClick={handleClear}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Tøm
              </button>
            </div>
          )}
        </div>
      </div>
    );
  },
);

AudioInput.displayName = "AudioInput";

export default AudioInput;
