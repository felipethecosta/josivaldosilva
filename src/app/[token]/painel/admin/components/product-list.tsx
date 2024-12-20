"use client"

import React, { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/table"
import { Button } from "../../../../../components/ui/button"
import { Eye, Trash2 } from "lucide-react"
import Image from "next/image"
import { toast } from "../../../../../hooks/use-toast"

interface Product {
  id: string
  title: string
  imageUrl?: string
  active: boolean
  ProductVariant?: {
    id: string
    name: string
    price: number
  }[]
}

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("Falha ao carregar produtos");
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar produtos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleToggleVisibility = async (product: Product) => {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !product.active })
      })

      if (!response.ok) throw new Error("Erro ao alterar visibilidade")
      await fetchProducts()
      
      toast({
        title: "Sucesso",
        description: product.active ? "Produto ocultado" : "Produto visível",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao alterar visibilidade",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Erro ao excluir produto")
      await fetchProducts()
      
      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir produto",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Carregando produtos...</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead className="w-[100px]">Imagem</TableHead>
            <TableHead>Título</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                ) : (
                  "Sem imagem"
                )}
              </TableCell>
              <TableCell>{product.title}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleToggleVisibility(product)}
                >
                  <Eye className={`h-4 w-4 ${!product.active ? 'text-gray-400' : ''}`} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 