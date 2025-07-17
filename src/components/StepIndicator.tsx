import React from "react";

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    {
      number: 1,
      title: "Sett opp din DUMP",
    },
    {
      number: 2,
      title: "Last opp eller ta opp lyd",
    },
    {
      number: 3,
      title: "Transkriber",
    },
    {
      number: 4,
      title: "Generer strukturert innsikt",
    },
  ];

  return (
    <div className="w-full p-6 mb-6">
      <div className="relative">
        {/* Background line */}
        <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200"></div>
        
        {/* Progress line */}
        <div 
          className="absolute top-6 left-0 h-0.5 bg-blue-500 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {/* Steps */}
        <div className="relative grid grid-cols-4 gap-4">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              {/* Step Circle */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg relative z-10 ${
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
