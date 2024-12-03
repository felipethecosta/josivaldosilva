import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";
import QRCode from "qrcode";
import path from "path";
import fs from "fs/promises";

export async function POST(request: Request) {
  console.log("1. Iniciando verificação do código");

  try {
    const body = await request.json();
    console.log("2. Body recebido:", body);

    const { code } = body;
    console.log("3. Código recebido:", code);

    if (!code) {
      console.log("4. Código não fornecido");
      return NextResponse.json(
        { error: "Código não fornecido" },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    console.log("5. Buscando registro no banco de dados");
    const record = await prisma.record.findFirst({
      where: {
        code: code,
        active: true,
      },
    });

    console.log("6. Resultado da busca:", record);

    if (record) {
      // eslint-disable-next-line prefer-const
      let pixCode = record.pixCode;
      let qrCodePath = record.qrCodePath;

      // Se não houver pixCode, gere um valor ou retorne erro
      if (!pixCode) {
        console.error("PixCode não encontrado no registro!");
        return NextResponse.json(
          {
            error: "PixCode ausente no registro.",
          },
          {
            status: 500,
            headers: corsHeaders,
          }
        );
      }

      // Se não houver qrCodePath, verifique ou gere um novo QR code
      if (!qrCodePath) {
        const qrCodeFileName = `qrcode_${record.orderNumber}.png`;
        const qrCodeFilePath = path.join(
          process.cwd(),
          "public",
          "qrcodes",
          qrCodeFileName
        );

        try {
          // Verifica se o arquivo já existe
          await fs.access(qrCodeFilePath);
          qrCodePath = `/qrcodes/${qrCodeFileName}`;
        } catch (error) {
          // Se não existir, cria o diretório e gera o QR Code
          try {
            await fs.mkdir(path.dirname(qrCodeFilePath), { recursive: true });
            await QRCode.toFile(qrCodeFilePath, pixCode);
            qrCodePath = `/qrcodes/${qrCodeFileName}`;
          } catch (err) {
            console.error("Erro ao gerar QR Code:", err);
            return NextResponse.json(
              {
                error: "Erro ao gerar QR Code.",
                details:
                  err instanceof Error ? err.message : "Erro desconhecido",
              },
              {
                status: 500,
                headers: corsHeaders,
              }
            );
          }
        }
      }

      // Atualiza o registro no banco de dados se necessário
      if (pixCode !== record.pixCode || qrCodePath !== record.qrCodePath) {
        try {
          await prisma.record.update({
            where: { id: record.id },
            data: {
              pixCode: pixCode,
              qrCodePath: qrCodePath,
            },
          });
        } catch (err) {
          console.error("Erro ao atualizar registro no banco de dados:", err);
          return NextResponse.json(
            {
              error: "Erro ao atualizar registro no banco de dados.",
              details: err instanceof Error ? err.message : "Erro desconhecido",
            },
            {
              status: 500,
              headers: corsHeaders,
            }
          );
        }
      }

      // Formata endereço completo
      const fullAddress = `${record.address}, ${record.number}${
        record.complement ? ` - ${record.complement}` : ""
      }${record.reference ? ` - ${record.reference}` : ""} - ${
        record.bairro
      } - ${record.stateCity}`;

      const responseData = {
        valid: true,
        recordData: {
          name: record.name,
          address: record.address,
          number: record.number,
          complement: record.complement,
          reference: record.reference,
          bairro: record.bairro,
          stateCity: record.stateCity,
          zipCode: record.zipCode,
          fullAddress: fullAddress,
          valor: record.valor,
          orderNumber: record.orderNumber,
          pixCode: pixCode,
          qrCodeUrl: qrCodePath,
        },
      };

      console.log("7. Enviando resposta com dados do registro:", responseData);

      return NextResponse.json(responseData, {
        status: 200,
        headers: corsHeaders,
      });
    }

    console.log("8. Código não encontrado ou inativo");
    return NextResponse.json(
      {
        valid: false,
        error: "Código não encontrado ou inativo",
      },
      {
        status: 404,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("9. Erro na verificação:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor na verificação do código.",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
