import { writeFile } from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: "Arquivo não encontrado" },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Criar pasta se não existir
    const uploadDir = path.join(process.cwd(), 'public/uploads')
    await fs.mkdir(uploadDir, { recursive: true })

    // Salvar arquivo
    const fileName = `${Date.now()}_${file.name}`
    const filePath = path.join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    // Retornar URL pública
    const imageUrl = `/uploads/${fileName}`
    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Erro ao fazer upload:", error)
    return NextResponse.json(
      { error: "Erro ao fazer upload do arquivo" },
      { status: 500 }
    )
  }
} 