"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../../components/ui/dialog"
import { Card, CardContent } from "../../../../../components/ui/card"
import { Label } from "../../../../../components/ui/label"
import { Input } from "../../../../../components/ui/input"
import { Button } from "../../../../../components/ui/button"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

export function ProductForm({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const title = formData.get("title") as string
      const imageFile = formData.get("image") as File

      if (!title) {
        throw new Error("Título é obrigatório")
      }

      let imageUrl = null
      if (imageFile?.size > 0) {
        const uploadFormData = new FormData()
        uploadFormData.append("file", imageFile)
        
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        })

        if (!uploadResponse.ok) {
          throw new Error("Falha ao fazer upload da imagem")
        }

        const uploadResult = await uploadResponse.json()
        imageUrl = uploadResult.imageUrl
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          imageUrl
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao criar produto")
      }

      toast({
        title: "Sucesso",
        description: "Produto criado com sucesso",
      })
      
      onClose()
      window.location.reload()
    } catch (error) {
      console.error("Erro:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar produto",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Nome do Produto</Label>
                <Input id="title" name="title" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">Imagem do Produto</Label>
                <Input 
                  id="image" 
                  name="image" 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="max-w-[200px] rounded-md"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 