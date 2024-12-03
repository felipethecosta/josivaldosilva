"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface PaymentConfirmationProps {
  orderNumber: string;
  totalAmount: string;
  pixCode: string;
  qrCodeUrl: string;
}

export function PaymentConfirmation({
  orderNumber,
  totalAmount,
  pixCode,
  qrCodeUrl,
}: PaymentConfirmationProps) {
  const [timeLeft, setTimeLeft] = useState(13 * 60 * 60); // 13 hours in seconds
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const handleCopyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setIsCopied(true);
      toast({
        title: "Código PIX copiado!",
        description: "O código PIX foi copiado para a área de transferência.",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o código PIX.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-[800px] mx-auto px-4">
      <div className="text-center">
        <h1 className="text-[#58C22E] text-xl font-bold mb-8">
          Para finalizar a sua compra é só realizar o pagamento com Pix!
        </h1>

        <div className="bg-[#F8F9FA] rounded p-6 mb-4">
          <p className="text-gray-600 mb-0">Número do pedido</p>
          <p className="font-bold text-[#2196F3] text-2xl mb-4">
            {orderNumber}
          </p>
          <p className="text-gray-600 mb-2">
            Confirmação de pedido enviada para email de cadastro.
          </p>
        </div>

        <div className="bg-[#F8F9FA] rounded p-6">
          <div className="flex justify-center items-center gap-2 mb-6">
            <Image src="/pix.png" alt="PIX" width={24} height={24} />
            <span className="font-bold text-[#020617]">Pagamento via Pix</span>
          </div>

          <p className="text-gray-600 text-sm mb-6">
            Escaneie o código QR com a câmera do seu celular ou copie e cole o
            código, no aplicativo do seu banco.
          </p>

          <div className="bg-white p-3 rounded mb-4 text-sm break-all">
            {pixCode}
          </div>

          <Button
            className={`w-full bg-[#58C22E] hover:bg-[#4CAF50] text-white mb-4 ${
              isCopied ? "opacity-75" : ""
            }`}
            onClick={handleCopyPixCode}
          >
            {isCopied ? "Código Pix copiado!" : "Copiar código Pix"}
          </Button>

          <p className="text-sm text-gray-600 mb-4 font-bold">
            O código é válido por mais {hours.toString().padStart(2, "0")}:
            {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}
          </p>

          <div className="mb-4">
            {qrCodeUrl ? (
              <Image
                src={qrCodeUrl}
                alt="QR Code Pix"
                width={200}
                height={200}
                className="mx-auto"
              />
            ) : (
              <div className="w-[200px] h-[200px] bg-gray-200 mx-auto flex items-center justify-center">
                <span className="text-gray-500">QR Code não disponível</span>
              </div>
            )}
          </div>

          <p className="text-[#0083CA] font-bold text-lg mb-4">{totalAmount}</p>

          <p className="text-sm text-gray-500 font-bold">
            Se o pagamento não for confirmado, não se preocupe. O pedido será
            cancelado automaticamente.
          </p>
        </div>
      </div>
    </div>
  );
}
