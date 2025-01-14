"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

interface RecordData {
  name: string;
  address: string;
  number: string;
  complement?: string;
  reference?: string;
  bairro: string;
  stateCity: string;
  zipCode: string;
  valor?: number;
  product?: {
    id: string;
    title: string;
    imageUrl?: string;
  };
}

interface DeliveryOptionsProps {
  onContinue: () => void;
  recordData: RecordData;
}

export function DeliveryOptions({
  onContinue,
  recordData,
}: DeliveryOptionsProps) {
  const fullAddress = `${recordData.address}, ${recordData.number}${
    recordData.complement ? ` - ${recordData.complement}` : ""
  }${recordData.reference ? ` - ${recordData.reference}` : ""} - ${
    recordData.bairro
  } - ${recordData.stateCity}`;

  return (
    <div className={inter.className}>
      <div className="w-full max-w-[800px] mx-auto px-4">
        <h1 className="text-2xl font-semibold text-[#0083CA] mb-8">
          Opções de entrega
        </h1>

        <div className="space-y-6">
          {/* Endereço de entrega */}
          <div>
            <h2 className="text-lg text-[#404040] mb-2">Endereço de entrega</h2>
            <div className="text-[#404040]">
              <p className="font-medium">{recordData.name}</p>
              <p>{fullAddress}</p>
              <p>CEP: {recordData.zipCode}</p>
            </div>
          </div>

          {/* Alert */}
          <div className="bg-[#FFF3CD] border border-[#FFE69C] rounded-lg py-3 px-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[#856404]" />
              <p className="text-[#856404]">
                Antes de continuar revise se o{" "}
                <span className="font-bold text-black">
                  endereço e a opção de entrega estão corretos.
                </span>
              </p>
            </div>
          </div>

          {/* Delivery Item */}
          <div className="bg-[#F8F9FA] rounded-md p-4 sm:p-6">
            <h3 className="text-[#404040] text-base sm:text-lg font-medium mb-4">
              Entrega 01 de 01
            </h3>
            
            <div className="flex flex-col sm:flex-row items-start gap-4">
              {/* Imagem do produto */}
              {recordData.product?.imageUrl && (
                <div className="flex-shrink-0 w-[100px] sm:w-[120px]">
                  <Image
                    src={recordData.product.imageUrl}
                    alt={recordData.product.title}
                    width={120}
                    height={120}
                    className="w-full h-auto object-contain rounded-md"
                  />
                </div>
              )}

              {/* Informações do produto */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-[#404040] text-sm sm:text-base font-medium leading-snug mb-1">
                      {recordData.product?.title}
                    </h4>
                    <p className="text-[#404040] text-base sm:text-lg font-medium">
                      R$ {recordData.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} no Pix
                    </p>
                  </div>
                  {/* Frete Grátis - Ajustado para ficar ao lado em todas as resoluções */}
                  <div className="ml-2">
                    <p className="text-green-600 text-xs sm:text-sm font-medium whitespace-nowrap">
                      Frete Grátis
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Vendido e entregue por</span>
                  <Image
                    src="/magaluuuuu.png"
                    alt="Magalu"
                    width={60}
                    height={15}
                    className="object-contain"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Receba em até 3 dias úteis</p>
                    <p className="text-xs text-gray-500">
                      Após o pagamento confirmado
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col items-center space-y-4">
            <Button
              onClick={onContinue}
              className="w-full sm:w-[200px] h-[42px] bg-[#58C22E] hover:bg-[#4CAF50] text-white"
            >
              Continuar
            </Button>
            <p className="text-sm text-gray-500 text-center">
              Os prazos de entrega começam a contar a partir da confirmação de
              pagamento e podem variar para mais de uma unidade de um mesmo
              produto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
