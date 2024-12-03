import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const { active } = await request.json();

    const updatedRecord = await prisma.record.update({
      where: { id },
      data: { active },
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
