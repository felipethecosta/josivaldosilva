"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CheckoutSteps } from "@/components/checkout-steps";
import { IdentificationForm } from "@/components/identification-form";
import { DeliveryOptions } from "@/components/delivery-option";
import { PaymentPage } from "@/components/payment-page";
import { PaymentConfirmation } from "@/components/payment-confirmation";
import { formatCurrency } from "@/lib/utils";

interface RecordData {
  name: string;
  address: string;
  number: string;
  complement?: string;
  reference?: string;
  bairro: string;
  stateCity: string;
  zipCode: string;
  fullAddress: string;
  valor: number;
  orderNumber: string;
  pixCode: string;
  qrCodeUrl: string;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [recordData, setRecordData] = useState<RecordData | null>(null);

  const handleVerificationComplete = async (verifiedCode: string) => {
    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: verifiedCode }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.valid && data.recordData) {
          setRecordData(data.recordData);
          setCurrentStep(2);
        } else {
          console.error("Código inválido");
        }
      } else {
        console.error("Falha ao buscar dados do registro");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const handleDeliveryComplete = () => {
    setCurrentStep(3);
  };

  const handlePaymentComplete = () => {
    setCurrentStep(4);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <div className="py-4">
        <CheckoutSteps currentStep={currentStep} />
      </div>
      <main className="flex-1 py-8">
        {currentStep === 1 && (
          <IdentificationForm
            onVerificationComplete={handleVerificationComplete}
          />
        )}
        {currentStep === 2 && recordData && (
          <DeliveryOptions
            onContinue={handleDeliveryComplete}
            recordData={recordData}
          />
        )}
        {currentStep === 3 && recordData && (
          <PaymentPage
            onComplete={handlePaymentComplete}
            valor={recordData.valor}
            recordData={recordData}
          />
        )}
        {currentStep === 4 && recordData && (
          <PaymentConfirmation
            orderNumber={recordData.orderNumber}
            totalAmount={formatCurrency(recordData.valor)}
            pixCode={recordData.pixCode}
            qrCodeUrl={recordData.qrCodeUrl}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
