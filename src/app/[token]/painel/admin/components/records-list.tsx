import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { differenceInDays } from "date-fns"
import { Eye, Pencil, Trash2, Power } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { SearchCommand } from "./search-command"
import { DateRangeFilter } from "./date-range-filter"
import { DateRange } from "react-day-picker"

export interface Record {
  orderNumber: string
  product: string
  pixCode: string
  id: string
  code: string
  name: string
  address: string
  number: string
  complement?: string
  reference?: string
  bairro: string
  stateCity: string
  zipCode: string
  valor: number
  status: string
  cpfCnpj: string
  active: boolean
  createdAt: string
  paymentMethod: string
  observations?: string
}

interface RecordsListProps {
  records: Record[]
  onEdit: (record: Record) => void
  onDelete: (id: string) => void
  onToggleActive: (id: string, active: boolean) => void
  onViewDetails: (record: Record) => void
}

interface SortConfig {
  key: keyof Record
  direction: "asc" | "desc"
}

export function RecordsList({
  records,
  onEdit,
  onDelete,
  onToggleActive,
  onViewDetails,
}: RecordsListProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "createdAt", direction: "desc" })
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [filteredRecords, setFilteredRecords] = useState(records)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    let result = [...records]
    
    // Filtro de busca
    if (searchTerm) {
      result = result.filter(record => 
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.cpfCnpj.includes(searchTerm)
      )
    }

    // Filtro de data
    if (dateRange?.from && dateRange?.to) {
      result = result.filter(record => {
        const recordDate = new Date(record.createdAt)
        const fromDate = new Date(dateRange.from!)
        const toDate = new Date(dateRange.to!)
        return recordDate >= fromDate && recordDate <= toDate
      })
    }

    setFilteredRecords(result)
  }, [records, searchTerm, dateRange])

  const getStatusBadge = (status: string, createdAt: string) => {
    const daysSincePending = differenceInDays(new Date(), new Date(createdAt))
    const isDelayed = status === "pendente" && daysSincePending > 3

    return (
      <div className="flex items-center gap-2">
        <Badge
          variant={
            status === "aprovado"
              ? "success"
              : status === "pendente"
              ? "warning"
              : "destructive"
          }
        >
          {status.toUpperCase()}
        </Badge>
        {isDelayed && (
          <Badge variant="destructive">
            {daysSincePending} DIAS
          </Badge>
        )}
      </div>
    )
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

      if (!response.ok) {
        throw new Error("Falha ao atualizar o status do registro")
      }

      onToggleActive(id, active)
      toast({
        title: "Sucesso",
        description: `Registro ${
          active ? "ativado" : "desativado"
        } com sucesso.`,
      })
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      toast({
        title: "Erro",
        description: "Falha ao atualizar o status do registro.",
        variant: "destructive",
      })
    }
  }

  const sortRecords = (records: Record[], { key, direction }: SortConfig) => {
    return [...records].sort((a, b) => {
      const aValue = String(a[key] ?? '');
      const bValue = String(b[key] ?? '');
      
      if (direction === "asc") {
        return aValue.localeCompare(bValue);
      }
      return bValue.localeCompare(aValue);
    });
  };

  const sortedRecords = sortRecords(filteredRecords, sortConfig)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <SearchCommand 
          onFilter={(term) => setSearchTerm(term)} 
          className="flex-1"
        />
        <DateRangeFilter 
          onDateChange={setDateRange}
          className="w-[300px]"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => setSortConfig({ key: "code", direction: sortConfig.direction === "asc" ? "desc" : "asc" })}>
                Código {sortConfig.key === "code" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => setSortConfig({ key: "name", direction: sortConfig.direction === "asc" ? "desc" : "asc" })}>
                Nome {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => setSortConfig({ key: "cpfCnpj", direction: sortConfig.direction === "asc" ? "desc" : "asc" })}>
                CPF/CNPJ {sortConfig.key === "cpfCnpj" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => setSortConfig({ key: "valor", direction: sortConfig.direction === "asc" ? "desc" : "asc" })}>
                Valor {sortConfig.key === "valor" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => setSortConfig({ key: "status", direction: sortConfig.direction === "asc" ? "desc" : "asc" })}>
                Status {sortConfig.key === "status" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => setSortConfig({ key: "paymentMethod", direction: sortConfig.direction === "asc" ? "desc" : "asc" })}>
                Método {sortConfig.key === "paymentMethod" && (sortConfig.direction === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => setSortConfig({ key: "active", direction: sortConfig.direction === "asc" ? "desc" : "asc" })}>
                Ativo {sortConfig.key === "active" && (sortConfig.direction === "asc" ? "↑" : "")}
              </TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRecords.map((record) => (
              <TableRow key={record.id} className="transition-all hover:bg-accent animate-in fade-in-50">
                <TableCell className="font-medium">{record.code}</TableCell>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.cpfCnpj}</TableCell>
                <TableCell>{formatCurrency(record.valor)}</TableCell>
                <TableCell>
                  {getStatusBadge(record.status, record.createdAt)}
                </TableCell>
                <TableCell className="capitalize">{record.paymentMethod}</TableCell>
                <TableCell>{record.active ? "Sim" : "Não"}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu 
                    open={openDropdown === record.id}
                    onOpenChange={(open) => setOpenDropdown(open ? record.id : null)}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Ações
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => {
                          onViewDetails(record);
                          setOpenDropdown(null);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          onEdit(record);
                          setOpenDropdown(null);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => {
                          onDelete(record.id);
                          setOpenDropdown(null);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          handleToggleActive(record.id, !record.active);
                          setOpenDropdown(null);
                        }}
                      >
                        <Power className="mr-2 h-4 w-4" />
                        {record.active ? "Desativar" : "Ativar"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

