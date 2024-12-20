"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

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
    product?: {
      id: string;
      title: string;
      imageUrl?: string;
    };
  };
}

export function PaymentPage({
  onComplete,
  valor,
  recordData,
}: PaymentPageProps) {
  const valorFormatado = formatCurrency(valor);

  return (
    <div className={inter.className}>
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <h1 className="text-2xl font-semibold text-[#0083CA] mb-8">
          Revisão do pedido
        </h1>

        <div className="space-y-6">
          {/* Cabeçalho do PIX */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Image
                src="/pix.png"
                alt="PIX"
                width={56}
                height={56}
              />
              <h2 className="text-[#4A4A4A] text-[22px] sm:text-[28px] font-medium">
                Pagar com Pix
              </h2>
            </div>
            <div className="bg-[#E8F5E9] text-[#1B5E20] px-4 py-1 rounded-full text-sm font-medium whitespace-nowrap">
              Aprovação em minutos
            </div>
          </div>

          {/* Valor */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-[#4A4A4A] text-lg sm:text-xl">Valor no Pix:</span>
            <span className="text-[#4A4A4A] text-xl sm:text-2xl font-semibold">
              {valorFormatado}
            </span>
          </div>

          {/* Produto */}
          <div className="bg-[#F8F9FA] rounded-md p-4 sm:p-6">
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
                    <p className="text-[#404040] text-sm sm:text-base font-medium leading-snug mb-1">
                      {recordData.product?.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        Vendido e entregue por
                      </span>
                      <Image
                        src="/magaluuuuu.png"
                        alt="Magalu"
                        width={60}
                        height={15}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="ml-2">
                    <p className="text-green-600 text-xs sm:text-sm font-medium whitespace-nowrap">
                      Frete Grátis
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Pagamento PIX */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-[32px] h-[32px] rounded-full border border-[#717171] flex items-center justify-center">
                    <span className="text-[#717171]">1</span>
                  </div>
                </div>
                <p className="text-[#717171] text-base leading-tight mt-1">
                  Na próxima etapa copie e cole o código Pix
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-[32px] h-[32px] rounded-full border border-[#717171] flex items-center justify-center">
                    <span className="text-[#717171]">2</span>
                  </div>
                </div>
                <p className="text-[#717171] text-base leading-tight mt-1">
                  Abra o aplicativo de seu banco, escolha a opção &ldquo;Pix copia e cola&rdquo; e cole o código copiado
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-[32px] h-[32px] rounded-full border border-[#717171] flex items-center justify-center">
                    <span className="text-[#717171]">3</span>
                  </div>
                </div>
                <p className="text-[#717171] text-base leading-tight mt-1">
                  Confira os dados e valores e autorize o pagamento no aplicativo do banco
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              O código tem validade de 13h e você vai receber a confirmação do pagamento no e-mail e através dos nossos canais. E pronto!
            </p>
          </div>

          <Button
            onClick={onComplete}
            className="w-full bg-[#58C22E] hover:bg-[#4CAF50] text-white h-12"
          >
            Concluir pedido
          </Button>
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
