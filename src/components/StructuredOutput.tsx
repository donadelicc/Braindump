import React from "react";

interface CategoryOutput {
  title: string;
  description: string;
  insights: string[];
}

interface StructuredOutputData {
  summary: string;
  categories: CategoryOutput[];
  keyTakeaways: string[];
}

interface StructuredOutputProps {
  data: StructuredOutputData;
  sessionData: {
    name: string;
    description: string;
    objective: string;
  };
}

const StructuredOutput: React.FC<StructuredOutputProps> = ({
  data,
  sessionData,
}) => {
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
        <p className="text-gray-700">{data.summary}</p>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          🎯 Kategorier og innsikter
        </h3>
        <div className="space-y-4">
          {data.categories.map((category, index) => (
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
                {category.insights.map((insight, insightIndex) => (
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

      {/* Key Takeaways */}
      <div className="p-4 bg-green-50 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-3">
          🚀 Viktigste lærdommer
        </h3>
        <div className="space-y-2">
          {data.keyTakeaways.map((takeaway, index) => (
            <div key={index} className="flex items-start">
              <span className="text-green-600 mr-2 mt-1">→</span>
              <p className="text-gray-700">{takeaway}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StructuredOutput;
