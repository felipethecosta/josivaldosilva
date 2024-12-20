import { Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

interface ProcessStep {
  title: string;
  description: string;
  completed: boolean;
}

interface ProcessStepsProps {
  steps: ProcessStep[];
  currentStep: number;
}

export function ProcessSteps({ steps, currentStep }: ProcessStepsProps) {
  const progress = (currentStep / (steps.length - 1)) * 100;

  return (
    <div className={inter.className}>
      <Progress value={progress} className="mb-6 sm:mb-8" />
      <div className="space-y-6 sm:space-y-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start sm:items-center">
            <div
              className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                step.completed ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              {step.completed ? (
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              ) : (
                <span className="text-white text-xs sm:text-sm">
                  {index + 1}
                </span>
              )}
            </div>
            <div className="ml-3 sm:ml-4">
              <h3 className="text-base sm:text-lg font-semibold">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
