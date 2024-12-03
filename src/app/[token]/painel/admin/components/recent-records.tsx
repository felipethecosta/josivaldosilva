import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface Record {
  id: string;
  code: string;
  name: string;
  status: string;
  valor: number;
  createdAt: string;
}

interface RecentRecordsProps {
  records: Record[];
}

export function RecentRecords({ records }: RecentRecordsProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pendente":
        return "bg-yellow-500/10 text-yellow-500";
      case "aprovado":
        return "bg-green-500/10 text-green-500";
      case "recusado":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registros Recentes</CardTitle>
        <CardDescription>
          Os últimos 5 registros adicionados ao sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {records.slice(0, 5).map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between space-x-4"
            >
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm font-medium">{record.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Código: {record.code}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {formatCurrency(record.valor)}
                  </p>
                  <Badge
                    variant="secondary"
                    className={getStatusColor(record.status)}
                  >
                    {record.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
