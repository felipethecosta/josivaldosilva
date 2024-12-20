"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, AlertTriangle } from "lucide-react";
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

interface IdentificationFormProps {
  onVerificationComplete: (verifiedCode: string) => Promise<void>;
}

export function IdentificationForm({
  onVerificationComplete,
}: IdentificationFormProps) {
  const [code, setCode] = useState("");
  const [isSubmitting] = useState(false);
  const [showSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.valid) {
        onVerificationComplete(code);
      } else {
        setError(
          data.error ||
            "Código inválido. Por favor, verifique e tente novamente."
        );
      }
    } catch (error) {
      console.error("Erro ao verificar o código:", error);
      setError("Erro ao verificar o código. Por favor, tente novamente.");
    }
  };

  return (
    <div className={inter.className}>
      <div className="w-full max-w-[580px] mx-auto px-4 sm:px-6">
        <div className="border-t border-b border-[#e0e0e0] py-4">
          <h1 className="text-[#0083CA] text-xl sm:text-2xl font-semibold text-center">
            Identificação
          </h1>
        </div>

        <div className="py-6 sm:py-8">
          <h2 className="text-[#404040] text-lg sm:text-xl font-semibold text-center mb-6 sm:mb-8">
            Insira seu código de identificação
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Insira seu código"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-[42px] border-gray-300 rounded text-base"
              required
              disabled={isSubmitting}
            />

            <Button
              type="submit"
              className="w-full h-[42px] bg-[#58C22E] hover:bg-[#4CAF50] text-white font-normal text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processando..." : "Continuar"}
            </Button>

            {showSuccess && (
              <div className="flex items-center justify-center gap-2 text-[#4CAF50]">
                <Check className="h-5 w-5" />
                <span>Código verificado com sucesso!</span>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center gap-2 text-red-500">
                <AlertTriangle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            <div className="text-center text-[#757575] text-xs sm:text-sm mt-6">
              <p>
                Seus dados pessoais serão respeitados de acordo com a nossa
                política de privacidade. *Nada será publicado em sua timeline.
                Serviço válido somente para pessoas físicas.
              </p>
              <p className="mt-2">
                Em caso de dúvidas, acesse nossa central de atendimento.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
