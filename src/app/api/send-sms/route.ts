import { NextResponse } from "next/server";
import twilio from "twilio";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { numero, mensagem, twilioConfig } = await request.json();

    if (!numero || !mensagem) {
      return NextResponse.json(
        { error: "Número e mensagem são obrigatórios!" },
        { status: 400 }
      );
    }

    // Use as configurações fornecidas ou busque do banco de dados
    let config = twilioConfig;
    if (!config) {
      const savedConfig = await prisma.twilioConfig.findFirst({
        where: { id: 1 },
      });
      if (!savedConfig) {
        return NextResponse.json(
          { error: "Configurações do Twilio não encontradas" },
          { status: 500 }
        );
      }
      config = savedConfig;
    }

    const client = twilio(config.accountSid, config.authToken);
    const message = await client.messages.create({
      body: mensagem,
      from: config.phoneNumber,
      to: numero,
    });

    return NextResponse.json({
      success: true,
      messageId: message.sid,
    });
  } catch (error) {
    console.error("Erro ao enviar SMS:", error);
    return NextResponse.json(
      {
        error: "Erro ao enviar SMS",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
