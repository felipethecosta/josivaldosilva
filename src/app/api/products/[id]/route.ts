import { prisma } from "../../../../lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await prisma.product.delete({
      where: {
        id: (await params).id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao excluir produto" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise< { id: string }> }
) {
  try {
    const data = await req.json()
    
    const product = await prisma.product.update({
      where: { id: (await params).id },
      data: {
        title: data.title,
        imageUrl: data.imageUrl,
        active: data.active
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar produto" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await req.json()
    
    const product = await prisma.product.update({
      where: { id: (await params).id },
      data: { active: data.active }
    })

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar produto" },
      { status: 500 }
    )
  }
} 