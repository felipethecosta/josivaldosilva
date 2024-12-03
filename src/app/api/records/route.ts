import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  console.log("Iniciando GET /api/records");
  try {
    const records = await prisma.record.findMany();
    console.log(`${records.length} registros encontrados`);
    return NextResponse.json(records);
  } catch (error) {
    console.error("Erro ao buscar registros:", error);
    return NextResponse.json(
      { error: "Erro ao buscar registros" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  console.log("Iniciando POST /api/records");
  try {
    const formData = await request.formData();
    console.log("FormData recebido:", Object.fromEntries(formData));

    const recordData = {
      name: formData.get("name") as string,
      cpfCnpj: formData.get("cpfCnpj") as string,
      orderNumber: formData.get("orderNumber") as string,
      code: formData.get("code") as string,
      address: formData.get("address") as string,
      zipCode: formData.get("zipCode") as string,
      complement: (formData.get("complement") as string) || undefined,
      reference: (formData.get("reference") as string) || undefined,
      product: (formData.get("product") as string) || "",
      stateCity: formData.get("stateCity") as string,
      bairro: formData.get("bairro") as string,
      valor: parseFloat(formData.get("valor") as string),
      status: formData.get("status") as string,
      number: formData.get("number") as string,
      used: false,
      active: true,
      pixCode: formData.get("pixCode") as string,
      qrCodePath: formData.get("qrCodePath") as string, // Agora armazenamos o base64 diretamente
    };

    console.log("Dados do registro a serem salvos:", recordData);

    const record = await prisma.record.create({
      data: recordData,
    });

    console.log("Registro criado com sucesso:", record);
    return NextResponse.json(record);
  } catch (error) {
    console.error("Erro ao criar registro:", error);
    return NextResponse.json(
      {
        error:
          "Erro ao criar registro: " +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // console.log(`Iniciando PUT /api/records/${params.id}`);
  try {
    const id = (await params).id;
    const formData = await request.formData();
    console.log(
      "FormData recebido para atualização:",
      Object.fromEntries(formData)
    );

    const updatedRecord = await prisma.record.update({
      where: { id },
      data: {
        name: formData.get("name") as string,
        cpfCnpj: formData.get("cpfCnpj") as string,
        orderNumber: formData.get("orderNumber") as string,
        code: formData.get("code") as string,
        address: formData.get("address") as string,
        zipCode: formData.get("zipCode") as string,
        complement: (formData.get("complement") as string) || undefined,
        reference: (formData.get("reference") as string) || undefined,
        product: formData.get("product") as string,
        stateCity: formData.get("stateCity") as string,
        bairro: formData.get("bairro") as string,
        valor: parseFloat(formData.get("valor") as string),
        status: formData.get("status") as string,
        number: formData.get("number") as string,
        pixCode: formData.get("pixCode") as string,
        qrCodePath: formData.get("qrCodePath") as string, // Atualiza o base64 do QR code
      },
    });

    console.log("Registro atualizado com sucesso:", updatedRecord);
    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error("Erro ao atualizar registro:", error);
    return NextResponse.json(
      {
        error:
          "Erro ao atualizar registro: " +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}

// DELETE e PATCH permanecem inalterados

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // console.log(`Iniciando PATCH /api/records/${params.id}`);
  try {
    const id = (await params).id;
    const json = await request.json();
    console.log("Dados recebidos para atualização de status:", json);

    const updatedRecord = await prisma.record.update({
      where: { id },
      data: { active: json.active },
    });

    console.log("Status do registro atualizado com sucesso:", updatedRecord);
    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error("Erro ao atualizar status do registro:", error);
    return NextResponse.json(
      {
        error:
          "Erro ao atualizar status do registro: " +
          (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}
