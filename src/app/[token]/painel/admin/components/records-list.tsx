import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export interface Record {
  orderNumber: string;
  product: string;
  pixCode: string;
  id: string;
  code: string;
  name: string;
  address: string;
  number: string;
  complement?: string;
  reference?: string;
  bairro: string;
  stateCity: string;
  zipCode: string;
  valor: number;
  status: string;
  cpfCnpj: string;
  active: boolean;
  createdAt: string;
}

interface RecordsListProps {
  records: Record[];
  onEdit: (record: Record) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

export function RecordsList({
  records,
  onEdit,
  onDelete,
  onToggleActive,
}: RecordsListProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      pendente: "bg-[#d97706] text-white",
      aprovado: "bg-[#84cc16] text-white",
      recusado: "bg-[#dc2626] text-white",
    } as const;

    return (
      <Badge
        className={variants[status as keyof typeof variants] || "bg-gray-500"}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      const response = await fetch(`/api/records/${id}/toggle-active`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active }),
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar o status do registro");
      }

      onToggleActive(id, active);
      toast({
        title: "Sucesso",
        description: `Registro ${
          active ? "ativado" : "desativado"
        } com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar o status do registro.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>CPF/CNPJ</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead>Bairro</TableHead>
            <TableHead>Cidade/Estado</TableHead>
            <TableHead>CEP</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ativo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.code}</TableCell>
              <TableCell>{record.name}</TableCell>
              <TableCell>{record.cpfCnpj}</TableCell>
              <TableCell>{`${record.address}, ${record.number}${
                record.complement ? ` - ${record.complement}` : ""
              }`}</TableCell>
              <TableCell>{record.bairro}</TableCell>
              <TableCell>{record.stateCity}</TableCell>
              <TableCell>{record.zipCode}</TableCell>
              <TableCell>{formatCurrency(record.valor)}</TableCell>
              <TableCell>{getStatusBadge(record.status)}</TableCell>
              <TableCell>{record.active ? "Sim" : "Não"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(record)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(record.id)}
                  >
                    Excluir
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleToggleActive(record.id, !record.active)
                    }
                  >
                    {record.active ? "Desativar" : "Ativar"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
