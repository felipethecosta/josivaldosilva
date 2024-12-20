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
        { status: 400, headers: corsHeaders }
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
      const pixCode = record.pixCode;
      let qrCodePath = record.qrCodePath;

      if (!pixCode) {
        console.error("PixCode não encontrado no registro!");
        return NextResponse.json(
          { error: "PixCode ausente no registro." },
          { status: 500, headers: corsHeaders }
        );
      }

      // Gerar QR Code se necessário
      if (!qrCodePath) {
        const qrCodeFileName = `qrcode_${record.orderNumber}.png`;
        const qrCodeFilePath = path.join(process.cwd(), "public", "qrcodes", qrCodeFileName);

        try {
          await fs.access(qrCodeFilePath);
          qrCodePath = `/qrcodes/${qrCodeFileName}`;
        } catch (error) {
          try {
            await fs.mkdir(path.dirname(qrCodeFilePath), { recursive: true });
            await QRCode.toFile(qrCodeFilePath, pixCode);
            qrCodePath = `/qrcodes/${qrCodeFileName}`;
          } catch (err) {
            console.error("Erro ao gerar QR Code:", err);
            return NextResponse.json(
              { error: "Erro ao gerar QR Code." },
              { status: 500, headers: corsHeaders }
            );
          }
        }
      }

      // Atualizar registro se necessário
      if (pixCode !== record.pixCode || qrCodePath !== record.qrCodePath) {
        await prisma.record.update({
          where: { id: record.id },
          data: { pixCode, qrCodePath },
        });
      }

      const fullAddress = `${record.address}, ${record.number}${
        record.complement ? ` - ${record.complement}` : ""
      }${record.reference ? ` - ${record.reference}` : ""} - ${
        record.bairro
      } - ${record.stateCity}`;

      // Buscar o produto relacionado ao registro
      const product = await prisma.product.findFirst({
        where: {
          title: record.product
        }
      });

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
          product: {
            id: product?.id || record.id,
            title: record.product,
            imageUrl: product?.imageUrl || record.qrCodePath
          }
        },
      };

      console.log("7. Enviando resposta com dados do registro:", responseData);
      return NextResponse.json(responseData, { status: 200, headers: corsHeaders });
    }

    console.log("8. Código não encontrado ou inativo");
    return NextResponse.json(
      { valid: false, error: "Código não encontrado ou inativo" },
      { status: 404, headers: corsHeaders }
    );
  } catch (error) {
    console.error("9. Erro na verificação:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor na verificação do código." },
      { status: 500, headers: corsHeaders }
    );
  }
}
