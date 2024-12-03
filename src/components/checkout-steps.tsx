import { ShoppingBag, User, Truck, CreditCard } from "lucide-react";

interface CheckoutStep {
  icon: React.ReactNode;
  label: string;
}

export function CheckoutSteps({ currentStep }: { currentStep: number }) {
  const steps: CheckoutStep[] = [
    { icon: <ShoppingBag className="w-4 h-4" />, label: "Sacola" },
    { icon: <User className="w-4 h-4" />, label: "Identificação" },
    { icon: <Truck className="w-4 h-4" />, label: "Entrega" },
    { icon: <CreditCard className="w-4 h-4" />, label: "Pagamento" },
  ];

  const getStepColor = (index: number) => {
    if (index === currentStep) return "#2196F3"; // Azul para etapa atual
    if (index < currentStep) return "#4CAF50"; // Verde para etapas completadas
    return "#9E9E9E"; // Cinza para etapas futuras
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 bg-white">
      <div className="flex justify-between items-center relative">
        {/* Connecting lines */}
        <div className="absolute top-[14px] left-[32px] right-[32px] flex">
          {steps.slice(0, -1).map((_, index) => (
            <div
              key={index}
              className="h-[1px] flex-1"
              style={{
                backgroundColor: getStepColor(index + 1),
              }}
            />
          ))}
        </div>

        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center relative z-10">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-200"
              style={{
                borderColor: getStepColor(index),
                color: getStepColor(index),
                backgroundColor: "white",
              }}
            >
              {step.icon}
            </div>
            <span
              className="mt-1 text-xs font-medium"
              style={{ color: getStepColor(index) }}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
