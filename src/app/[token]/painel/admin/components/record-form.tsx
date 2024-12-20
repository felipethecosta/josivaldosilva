"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { toast } from "@/hooks/use-toast"



export interface RecordFormData {
  name: string
  cpfCnpj: string
  orderNumber: string
  code: string
  address: string
  number: string
  zipCode: string
  complement?: string
  reference?: string
  product: string
  stateCity: string
  bairro: string
  valor: number
  status: string
  pixCode?: string
  qrCodePath?: string
  paymentMethod: string
  observations?: string
}

interface RecordFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: RecordFormData) => Promise<void>
  initialData?: Partial<RecordFormData>
}

interface Product {
  id: string
  title: string
  imageUrl?: string
  description?: string
}

export function RecordForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: RecordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [qrCodePreview, setQrCodePreview] = useState<string>("")
  const [formErrors] = useState<Record<string, string>>({})
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Carrega produtos
  useEffect(() => {
    let isMounted = true // Para evitar memory leaks

    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        const data = await response.json()
        
        if (!isMounted) return

        if (Array.isArray(data)) {
          setProducts(data)
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
      }
    }

    fetchProducts()

    return () => {
      isMounted = false
    }
  }, []) // Dependência vazia pois só queremos carregar uma vez

  // Efeito separado para lidar com o produto inicial
  useEffect(() => {
    if (initialData?.product && products.length > 0) {
      const initialProduct = products.find(p => p.title === initialData.product)
      if (initialProduct) {
        setSelectedProduct(initialProduct)
      }
    }
  }, [initialData?.product, products])


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      
      // Converter o valor formatado para número
      const valorFormatado = formData.get("valor") as string;
      let valorNumerico = 0;

      if (valorFormatado) {
        valorNumerico = parseFloat(
          valorFormatado
            .replace(/[R$\s.]/g, '')
            .replace(',', '.')
        );
      }

      const data: RecordFormData = {
        name: formData.get("name") as string,
        cpfCnpj: formData.get("cpfCnpj") as string,
        orderNumber: formData.get("orderNumber") as string,
        code: formData.get("code") as string,
        address: formData.get("address") as string,
        number: formData.get("number") as string,
        zipCode: formData.get("zipCode") as string,
        complement: formData.get("complement") as string,
        reference: formData.get("reference") as string,
        product: selectedProduct?.title || "",
        stateCity: formData.get("stateCity") as string,
        bairro: formData.get("bairro") as string,
        valor: valorNumerico,
        status: formData.get("status") as string,
        pixCode: formData.get("pixCode") as string,
        qrCodePath: qrCodePreview, // Usar diretamente o base64 do preview
        paymentMethod: formData.get("paymentMethod") as string,
        observations: formData.get("observations") as string,
      }

      if (!selectedProduct) {
        toast({
          title: "Erro",
          description: "Selecione um produto",
          variant: "destructive",
        })
        return
      }

      await onSubmit(data)
      onClose()
    } catch (error) {
      console.error("Erro ao salvar:", error)
      toast({
        title: "Erro",
        description: "Erro ao salvar registro",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
    e.target.value = value;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    e.target.value = value;
  };

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = (Number(value) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    e.target.value = value;
  };

  // Formatar valor inicial
  const formattedInitialValue = initialData?.valor 
    ? initialData.valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
      })
    : '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Registro" : "Novo Registro"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={initialData?.name}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                <Input
                  id="cpfCnpj"
                  name="cpfCnpj"
                  defaultValue={initialData?.cpfCnpj}
                  required
                  placeholder="000.000.000-00"
                  onChange={handleCPFChange}
                />
                {formErrors.cpfCnpj && (
                  <p className="text-sm text-red-500">{formErrors.cpfCnpj}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    name="address"
                    defaultValue={initialData?.address}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    name="number"
                    defaultValue={initialData?.number}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    name="bairro"
                    defaultValue={initialData?.bairro}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stateCity">Cidade/Estado</Label>
                  <Input
                    id="stateCity"
                    name="stateCity"
                    defaultValue={initialData?.stateCity}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    defaultValue={initialData?.zipCode}
                    required
                    placeholder="00000-000"
                    onChange={handleCEPChange}
                  />
                  {formErrors.zipCode && (
                    <p className="text-sm text-red-500">{formErrors.zipCode}</p>
                  )}
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    name="complement"
                    defaultValue={initialData?.complement}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reference">Ponto de Referência</Label>
                <Input
                  id="reference"
                  name="reference"
                  defaultValue={initialData?.reference}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="orderNumber">Número do Pedido</Label>
                  <Input
                    id="orderNumber"
                    name="orderNumber"
                    defaultValue={initialData?.orderNumber}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="code">Código</Label>
                  <Input
                    id="code"
                    name="code"
                    defaultValue={initialData?.code}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="product">Produto</Label>
                  <Select
                    name="product"
                    defaultValue={selectedProduct?.id}
                    onValueChange={(value) => {
                      const product = products.find(p => p.id === value)
                      setSelectedProduct(product || null)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o produto">
                        {selectedProduct?.title || "Selecione o produto"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(products) && products.length > 0 ? (
                        products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.title}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-products" disabled>
                          Nenhum produto cadastrado
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="valor">Valor</Label>
                  <Input
                    id="valor"
                    name="valor"
                    type="text"
                    defaultValue={formattedInitialValue}
                    required
                    placeholder="R$ 0,00"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value) {
                        const numero = parseFloat(value) / 100;
                        e.target.value = numero.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          minimumFractionDigits: 2
                        });
                      }
                    }}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="paymentMethod">Método de Pagamento</Label>
                  <Select
                    name="paymentMethod"
                    defaultValue={initialData?.paymentMethod || "pix"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="credit">Cartão de Crédito</SelectItem>
                      <SelectItem value="debit">Cartão de Débito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pixCode">Código PIX</Label>
                  <div className="flex gap-2">
                    <Input
                      id="pixCode"
                      name="pixCode"
                      defaultValue={initialData?.pixCode}
                      className="flex-1"
                      placeholder="Cole o código PIX aqui"
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const pixInput = document.getElementById('pixCode') as HTMLInputElement;
                        if (pixInput?.value) {
                          navigator.clipboard.writeText(pixInput.value);
                          toast({
                            title: "Copiado!",
                            description: "Código PIX copiado para área de transferência",
                          });
                        }
                      }}
                    >
                      Copiar PIX
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={initialData?.status || "pendente"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="aprovado">Aprovado</SelectItem>
                      <SelectItem value="recusado">Recusado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="qrCodeFile">QR Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="qrCodeFile"
                    name="qrCodeFile"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (e) => {
                          const base64 = e.target?.result as string
                          setQrCodePreview(base64)
                        }
                        reader.readAsDataURL(file)
                      }
                    }}
                  />
                  {qrCodePreview && (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button variant="outline">Preview</Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <img 
                          src={qrCodePreview} 
                          alt="QR Code Preview" 
                          className="w-full h-auto"
                        />
                      </HoverCardContent>
                    </HoverCard>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="observations">Observações</Label>
                <Textarea
                  id="observations"
                  name="observations"
                  defaultValue={initialData?.observations}
                  className="min-h-[100px]"
                />
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

