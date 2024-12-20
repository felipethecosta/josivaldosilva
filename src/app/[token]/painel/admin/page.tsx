"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Package2, Users, Wallet } from 'lucide-react'
import { toast } from "@/hooks/use-toast"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddRecordButton } from "./components/add-record-button"
import { RecordsList, Record } from "./components/records-list"
import { RecordForm, RecordFormData } from "./components/record-form"
import { RecordDetails } from "./components/record-details"
import { RecentRecords } from "./components/recent-records"
import { CodeGenerator } from "./components/code-generator"
import { Toaster } from "@/components/ui/toaster"
import { motion } from "framer-motion"

export default function AdminDashboard() {
  const [records, setRecords] = useState<Record[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<Record | null>(null)
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null)
  const [totalRecords, setTotalRecords] = useState(0)
  const [activeRecords, setActiveRecords] = useState(0)
  const [totalValue, setTotalValue] = useState(0)
  const [approvedRecords, setApprovedRecords] = useState(0)
  const [pendingRecords, setPendingRecords] = useState(0)
  const [rejectedRecords, setRejectedRecords] = useState(0)

  useEffect(() => {
    fetchRecords()
  }, [])

  useEffect(() => {
    if (records.length > 0) {
      setTotalRecords(records.length)
      setActiveRecords(records.filter((record) => record.active).length)
      setTotalValue(
        records
          .filter((record) => record.status === "aprovado")
          .reduce((acc, record) => acc + record.valor, 0)
      )
      setApprovedRecords(
        records.filter((record) => record.status === "aprovado").length
      )
      setPendingRecords(
        records.filter((record) => record.status === "pendente").length
      )
      setRejectedRecords(
        records.filter((record) => record.status === "recusado").length
      )
    }
  }, [records])

  const fetchRecords = async () => {
    try {
      const response = await fetch("/api/records")
      if (!response.ok) throw new Error("Failed to fetch records")
      const data = await response.json()
      setRecords(data)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar os registros.",
        variant: "destructive",
      })
    }
  }

  const handleAddRecord = () => {
    setEditingRecord(null)
    setIsFormOpen(true)
  }

  const handleEditRecord = (record: Record) => {
    setEditingRecord(record)
    setIsFormOpen(true)
  }

  const handleViewDetails = (record: Record) => {
    setSelectedRecord(record)
    setIsDetailsOpen(true)
  }

  const handleDeleteRecord = async (id: string) => {
    try {
      const response = await fetch(`/api/records/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete record")
      await fetchRecords()
      toast({
        title: "Sucesso",
        description: "Registro excluído com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao excluir o registro.",
        variant: "destructive",
      })
    }
  }

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const response = await fetch(`/api/records/${id}/toggle-active`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active }),
      })
      if (!response.ok) throw new Error("Failed to update record status")
      await fetchRecords()
      toast({
        title: "Sucesso",
        description: `Código ${active ? "ativado" : "desativado"} com sucesso.`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar o status do código.",
        variant: "destructive",
      })
    }
  }

  const handleFormSubmit = async (data: RecordFormData) => {
    try {
      const formData = new FormData()

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === "qrCodeFile" && value instanceof File) {
            formData.append(key, value)
          } else {
            formData.append(key, String(value))
          }
        }
      })

      let response
      if (editingRecord) {
        response = await fetch(`/api/records/${editingRecord.id}`, {
          method: "PUT",
          body: formData,
        })
      } else {
        response = await fetch("/api/records", {
          method: "POST",
          body: formData,
        })
      }

      if (!response.ok) throw new Error("Failed to save record")

      await fetchRecords()
      setIsFormOpen(false)
      setEditingRecord(null)
      toast({
        title: "Sucesso",
        description: editingRecord
          ? "Registro atualizado com sucesso."
          : "Novo registro adicionado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar o registro. Por favor, tente novamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <AddRecordButton onClick={handleAddRecord} />
      </div>

      <div className="space-y-6">
        <div className="grid gap-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Lembre-se sempre de preencher o cadastro conforme os dados
              informado na planilha.
            </AlertDescription>
          </Alert>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Verifique sempre com atenção o valor do produto do tipo.
            </AlertDescription>
          </Alert>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Evite falhas seja consciente no cadastro do cliente.
            </AlertDescription>
          </Alert>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="records">Registros</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-4 md:grid-cols-3"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Registros
                    </CardTitle>
                    <Package2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalRecords}</div>
                    <p className="text-xs text-muted-foreground">
                      {activeRecords} ativos no momento
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Valor Total
                    </CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(totalValue)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Soma dos registros aprovados
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Status dos Registros
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-[#84cc16]">Aprovados:</span>
                      <span className="font-bold text-[#84cc16]">
                        {approvedRecords}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#d97706]">Pendentes:</span>
                      <span className="font-bold text-[#d97706]">
                        {pendingRecords}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-[#dc2626]">Recusados:</span>
                      <span className="font-bold text-[#dc2626]">
                        {rejectedRecords}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Registros Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentRecords records={records} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gerador de Código</CardTitle>
                </CardHeader>
                <CardContent>
                  <CodeGenerator />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="records">
            <Card>
              <CardHeader>
                <CardTitle>Lista de Registros</CardTitle>
              </CardHeader>
              <CardContent>
                <RecordsList
                  records={records}
                  onEdit={handleEditRecord}
                  onDelete={handleDeleteRecord}
                  onToggleActive={handleToggleActive}
                  onViewDetails={handleViewDetails}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <RecordForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingRecord(null)
        }}
        onSubmit={handleFormSubmit}
        initialData={editingRecord || undefined}
      />

      <RecordDetails
        record={selectedRecord}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false)
          setSelectedRecord(null)
        }}
      />

      <Toaster />
    </div>
  )
}

