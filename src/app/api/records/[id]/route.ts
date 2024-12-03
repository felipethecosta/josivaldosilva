import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const formData = await request.formData();

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
        qrCodePath: formData.get("qrCodePath") as string,
      },
    });

    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error("Error updating record:", error);
    return NextResponse.json(
      { error: "Error updating record" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    await prisma.record.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error("Error deleting record:", error);
    return NextResponse.json(
      { error: "Error deleting record" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const json = await request.json();

    const updatedRecord = await prisma.record.update({
      where: { id },
      data: { active: json.active },
    });

    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error("Error updating record status:", error);
    return NextResponse.json(
      { error: "Error updating record status" },
      { status: 500 }
    );
  }
}
