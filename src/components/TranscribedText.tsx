import React from "react";

interface TranscribedTextProps {
  transcription: string;
  isTranscribing: boolean;
  error: string;
}

const TranscribedText: React.FC<TranscribedTextProps> = ({
  transcription,
  isTranscribing,
  error,
}) => {
  // Don't render anything if there's no content to show
  if (!transcription && !isTranscribing && !error) {
    return null;
  }

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Transkripsjonsresultater
      </h2>

      {/* Loading state */}
      {isTranscribing && (
        <div className="flex items-center justify-center p-8">
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
            Transkriberer lyd...
          </span>
        </div>
      )}

      {/* Transcription results */}
      {transcription && !isTranscribing && (
        <div className="p-4">
          <div className="text-blue-700 text-sm leading-relaxed bg-white p-3 rounded border">
            {transcription}
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !isTranscribing && (
        <div className="p-4 bg-red-50 rounded-lg">
          <h3 className="font-medium text-red-800 mb-2">Transkripsjonfeil:</h3>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default TranscribedText;
