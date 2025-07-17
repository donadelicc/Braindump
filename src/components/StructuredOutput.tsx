import React, { useState } from "react";

interface CategoryOutput {
  title: string;
  description: string;
  insights: string[];
}

interface StructuredOutputData {
  summary: string;
  categories: CategoryOutput[];
}

interface StructuredOutputProps {
  data: StructuredOutputData;
  sessionData: {
    name: string;
    description: string;
    objective: string;
  };
  onSave?: (
    sessionData: { name: string; description: string; objective: string },
    structuredOutput: StructuredOutputData,
  ) => Promise<void>;
}

const StructuredOutput: React.FC<StructuredOutputProps> = ({
  data,
  sessionData,
  onSave,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>("");
  const [isSaved, setIsSaved] = useState(false);
  // Defensive checks to prevent undefined errors
  if (!data) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg p-6">
        <p className="text-red-600">Ingen data tilgjengelig</p>
      </div>
    );
  }

  const categories = data.categories || [];

  const handleSave = async () => {
    if (!onSave) return;

    setIsSaving(true);
    setSaveError("");

    try {
      await onSave(sessionData, data);
      setIsSaved(true);
    } catch (error) {
      console.error("Error saving session:", error);
      setSaveError("Kunne ikke lagre økt. Prøv igjen.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Strukturert utgang
      </h2>

      {/* Session Context */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Økt-kontekst:</h3>
        <p className="text-sm text-blue-700">
          <strong>Navn:</strong> {sessionData.name}
        </p>
        <p className="text-sm text-blue-700 mt-1">
          <strong>Beskrivelse:</strong> {sessionData.description}
        </p>
        <p className="text-sm text-blue-700 mt-1">
          <strong>Mål:</strong> {sessionData.objective}
        </p>
      </div>

      {/* Summary */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          📝 Sammendrag
        </h3>
        <p className="text-gray-700">
          {data.summary || "Ingen sammendrag tilgjengelig"}
        </p>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          🎯 Kategorier og innsikter
        </h3>
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="mb-3">
                <h4 className="font-semibold text-gray-800 text-lg">
                  {category.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {category.description}
                </p>
              </div>
              <div className="space-y-2">
                {(category.insights || []).map((insight, insightIndex) => (
                  <div key={insightIndex} className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    <p className="text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      {onSave && (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSave}
              disabled={isSaving || isSaved}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isSaved
                  ? "bg-green-500 text-white cursor-not-allowed"
                  : isSaving
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isSaved ? "✓ Lagret" : isSaving ? "Lagrer..." : "Lagre DUMP"}
            </button>
            {saveError && <p className="text-red-600 text-sm">{saveError}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default StructuredOutput;
