import React, { useState } from "react";

interface SessionData {
  name: string;
  description: string;
  objective: string;
}

interface SessionSetupProps {
  onSessionComplete: (sessionData: SessionData) => void;
}

const SessionSetup: React.FC<SessionSetupProps> = ({ onSessionComplete }) => {
  const [sessionData, setSessionData] = useState<SessionData>({
    name: "",
    description: "",
    objective: "",
  });

  const handleInputChange = (field: keyof SessionData, value: string) => {
    setSessionData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (
      sessionData.name.trim() &&
      sessionData.description.trim() &&
      sessionData.objective.trim()
    ) {
      onSessionComplete(sessionData);
    }
  };

  const isFormValid =
    sessionData.name.trim() &&
    sessionData.description.trim() &&
    sessionData.objective.trim();

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 mx-auto">
      <div className="space-y-6">
        {/* Session Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Navn <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={sessionData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="F.eks: Hackathon ideer juli, AI startup ideer, Forretningsideer india..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Session Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Beskrivelse <span className="text-red-500">*</span>
          </label>
          <textarea
            value={sessionData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Beskriv kort hva denne DUMPEN handler om. Hva er konteksten og bakgrunnen?"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Session Objective */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mål <span className="text-red-500">*</span>
          </label>
          <textarea
            value={sessionData.objective}
            onChange={(e) => handleInputChange("objective", e.target.value)}
            placeholder="Hva håper du å oppnå med DUMPEN? Hvilke konkrete resultater ønsker du?"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              isFormValid
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Start DUMP
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionSetup;
