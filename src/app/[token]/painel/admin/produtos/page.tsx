"use client"

import { useState, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"
import { ProductForm } from "../components/product-form"
import { ProductList } from "../components/product-list"
import { PlusCircle } from "lucide-react"

export default function ProductsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  
  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
        <Button 
          onClick={() => setIsFormOpen(true)} 
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Carregando...</div>}>
            <ProductList />
          </Suspense>
        </CardContent>
      </Card>

      <ProductForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
      />
    </div>
  )
} 