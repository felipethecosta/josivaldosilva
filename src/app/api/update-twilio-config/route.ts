import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const config = await request.json();

    // Aqui você pode salvar as configurações no banco de dados
    // ou em outro local seguro de sua preferência
    
    // Exemplo usando Prisma (você precisará criar o modelo apropriado):
    const updatedConfig = await prisma.twilioConfig.upsert({
      where: { id: 1 }, // Assumindo que você mantém apenas uma configuração
      update: {
        accountSid: config.accountSid,
        authToken: config.authToken,
        phoneNumber: config.phoneNumber,
      },
      create: {
        accountSid: config.accountSid,
        authToken: config.authToken,
        phoneNumber: config.phoneNumber,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao atualizar configurações" },
      { status: 500 }
    );
  }
} 