import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface AddRecordButtonProps {
  onClick: () => void;
}

export function AddRecordButton({ onClick }: AddRecordButtonProps) {
  return (
    <Button onClick={onClick} className="flex items-center gap-2">
      <PlusCircle className="h-4 w-4" />
      Novo Registro
    </Button>
  );
}
