import React from "react";

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    {
      number: 1,
      title: "Sett opp økt",
      description: "Navn, beskrivelse og mål",
    },
    {
      number: 2,
      title: "Last opp eller ta opp lyd",
      description: "Velg lydfil eller bruk mikrofon",
    },
    {
      number: 3,
      title: "Få transkripsjon",
      description: "Konverter lyd til tekst",
    },
    {
      number: 4,
      title: "Få strukturert utgang",
      description: "Organiser og analyser innhold",
    },
  ];

  return (
    <div className="w-full p-6 mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  currentStep >= step.number
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > step.number ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  step.number
                )}
              </div>

              {/* Step Content */}
              <div className="mt-3 text-center">
                <h3
                  className={`text-sm font-semibold ${
                    currentStep >= step.number
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1 max-w-32">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  currentStep > step.number ? "bg-blue-500" : "bg-gray-200"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
