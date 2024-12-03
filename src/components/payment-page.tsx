"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

interface PaymentPageProps {
  onComplete: () => void;
  valor: number;
  recordData: {
    address: string;
    number: string;
    complement?: string;
    reference?: string;
    bairro: string;
    stateCity: string;
  };
}

export function PaymentPage({
  onComplete,
  valor,
  recordData,
}: PaymentPageProps) {
  const valorFormatado = formatCurrency(valor);

  // Formatação do endereço
  const fullAddress = `${recordData.address}, ${recordData.number}${
    recordData.complement ? ` - ${recordData.complement}` : ""
  }${recordData.reference ? ` - ${recordData.reference}` : ""} - ${
    recordData.bairro
  } - ${recordData.stateCity}`;

  return (
    <div className="w-full max-w-[800px] mx-auto px-4">
      <h1 className="text-2xl font-semibold text-[#0083CA] mb-8">
        Revisão do pedido
      </h1>

      <div className="space-y-8">
        {/* Produto e Entrega */}
        <div className="bg-[#F8F9FA] rounded-md p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-[#404040] font-medium mb-2">
                <p className="text-[#020617] font-bold">Entrega 01 de 01</p> por
                Magalu - Receba em até 3 dias úteis
              </h2>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-[#404040]">
                    01 Ar-condicionado Split Hi-Wall LG Dual Inverter Compact
                    +AI 9.000 BTUs Frio Compact S3-Q12JAQAL
                  </p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-gray-200 rounded text-sm">
                      9.000
                    </span>
                    <span className="px-2 py-1 bg-gray-200 rounded text-sm">
                      Branco
                    </span>
                    <span className="px-2 py-1 bg-gray-200 rounded text-sm">
                      220V
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[#404040]">
              <p>Endereço para a entrega 01: {fullAddress}</p>
            </div>
          </div>
        </div>

        {/* Forma de Pagamento */}
        <div>
          <h2 className="text-xl font-semibold text-[#404040] mb-4">
            Escolha a forma de pagamento
          </h2>

          <div className="bg-[#F8F9FA] rounded-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/pix.png"
                  alt="PIX"
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <span className="font-medium">Pix</span>
                <span className="text-xs px-2 py-1 bg-[#58C22E] text-white rounded">
                  Aprovação em minutos
                </span>
              </div>
            </div>

            <div className="text-[#0083CA] font-bold text-lg font-medium mb-4">
              {valorFormatado}
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Copie o código Pix na próxima etapa e faça o pagamento na
              instituição financeira de sua escolha. O código tem validade de 13
              horas.
            </p>

            <Button
              onClick={onComplete}
              className="w-full bg-[#58C22E] hover:bg-[#4CAF50] text-white h-[42px]"
            >
              Concluir pedido
            </Button>
          </div>
        </div>

        {/* Resumo de valores */}
        <div className="bg-[#F8F9FA] rounded-md p-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Produtos (1)</span>
              <span className="text-[#0083CA] font-bold">{valorFormatado}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Frete</span>
              <span>Grátis</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total</span>
              <span className="text-[#0083CA] font-bold">
                {valorFormatado} no Pix
              </span>
            </div>
          </div>
        </div>

        {/* Footer text */}
        <div className="text-center space-y-4 text-sm text-gray-500">
          <p>
            <a
              href="https://especiais.magazineluiza.com.br/termo-compra-venda/"
              className="underline"
            >
              Clique aqui para ler o termo de compra e venda
            </a>
          </p>
          <p>
            O valor total da compra, mesmo dividido em parcelas de pequeno
            valor, não poderá exceder o limite do seu cartão de crédito. Para
            maiores informações, consulte a administradora do seu cartão.
          </p>
        </div>
      </div>
    </div>
  );
}
