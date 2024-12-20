"use client"

import { format, differenceInDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import type { Record } from "./records-list"
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface RecordDetailsProps {
  record: Record | null
  isOpen: boolean
  onClose: () => void
}

interface HistoryEntry {
  date: string
  action: string
  user: string
}

export function RecordDetails({ record, isOpen, onClose }: RecordDetailsProps) {
  const [history] = useState<HistoryEntry[]>([
    {
      date: "2024-01-10T10:00:00",
      action: "Registro criado",
      user: "Admin"
    },
    {
      date: "2024-01-11T15:30:00",
      action: "Status alterado para Aprovado",
      user: "Admin"
    }
  ])

  if (!record) return null

  const daysSincePending = record.status === "pendente" 
    ? differenceInDays(new Date(), new Date(record.createdAt))
    : 0

  const isDelayed = daysSincePending > 3

  const handleObservationsUpdate = async (observations: string) => {
    try {
      const response = await fetch(`/api/records/${record.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ observations }),
      })

      if (!response.ok) throw new Error("Failed to update observations")

      toast({
        title: "Sucesso",
        description: "Observações atualizadas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar observações.",
        variant: "destructive",
      })
    }
  }


  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalhes do Registro</SheetTitle>
        </SheetHeader>
        
        <Tabs defaultValue="info" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="payment">Pagamento</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  Status
                  <Badge
                    variant={
                      record.status === "aprovado"
                        ? "success"
                        : record.status === "pendente"
                        ? "warning"
                        : "destructive"
                    }
                  >
                    {record.status.toUpperCase()}
                  </Badge>
                  {isDelayed && (
                    <Badge variant="destructive">
                      {daysSincePending} DIAS ATRASADO
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Nome</Label>
                  <div className="text-sm">{record.name}</div>
                </div>
                <div className="grid gap-2">
                  <Label>CPF/CNPJ</Label>
                  <div className="text-sm">{record.cpfCnpj}</div>
                </div>
                <div className="grid gap-2">
                  <Label>Endereço</Label>
                  <div className="text-sm">
                    {`${record.address}, ${record.number}${
                      record.complement ? ` - ${record.complement}` : ""
                    }`}
                    <br />
                    {`${record.bairro} - ${record.stateCity}`}
                    <br />
                    {`CEP: ${record.zipCode}`}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Data de Cadastro</Label>
                  <div className="text-sm">
                    {format(new Date(record.createdAt), "PPP 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  className="min-h-[100px]"
                  placeholder="Adicione observações sobre este registro..."
                  defaultValue={record.observations || ""}
                  onChange={(e) => handleObservationsUpdate(e.target.value)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>Número do Pedido</Label>
                  <div className="text-sm">{record.orderNumber}</div>
                </div>
                <div className="grid gap-2">
                  <Label>Produto</Label>
                  <div className="text-sm">{record.product}</div>
                </div>
                <div className="grid gap-2">
                  <Label>Valor</Label>
                  <div className="text-sm font-semibold">
                    {formatCurrency(record.valor)}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="paymentMethod">Método de Pagamento</Label>
                    <Select
                      name="paymentMethod"
                      defaultValue={record.paymentMethod}
                    >
                      {/* ... */}
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={record.status}>
                      {/* ... */}
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pixCode">Código PIX</Label>
                  <div className="flex gap-2">
                    <Input
                      id="pixCode"
                      name="pixCode"
                      defaultValue={record.pixCode}
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Alterações</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] pr-4">
                  {history.map((entry, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{entry.action}</p>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(entry.date), "PPp", { locale: ptBR })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">por {entry.user}</p>
                      {index < history.length - 1 && <Separator className="my-2" />}
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

