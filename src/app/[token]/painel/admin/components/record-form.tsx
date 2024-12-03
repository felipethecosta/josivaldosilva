"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface RecordFormData {
  name: string;
  cpfCnpj: string;
  orderNumber: string;
  code: string;
  address: string;
  number: string;
  zipCode: string;
  complement?: string;
  reference?: string;
  product: string;
  stateCity: string;
  bairro: string;
  valor: number;
  status: string;
  pixCode: string;
  qrCodePath?: string;
}

interface RecordFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RecordFormData) => void;
  initialData?: RecordFormData;
}

export function RecordForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: RecordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialData?.qrCodePath) {
      setQrCodePreview(initialData.qrCodePath);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Iniciando submissão do formulário");

    try {
      setIsSubmitting(true);

      const formData = new FormData(e.currentTarget);
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
        product: formData.get("product") as string,
        stateCity: formData.get("stateCity") as string,
        bairro: formData.get("bairro") as string,
        valor: parseFloat(formData.get("valor") as string),
        status: formData.get("status") as string,
        pixCode: formData.get("pixCode") as string,
        qrCodePath: qrCodePreview || undefined,
      };

      console.log("Dados do formulário:", data);
      await onSubmit(data);

      toast({
        title: "Sucesso",
        description: "Registro salvo com sucesso",
      });

      onClose();
    } catch (error) {
      console.error("Erro na submissão do formulário:", error);
      toast({
        title: "Erro",
        description: "Falha ao salvar o registro. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQrCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrCodePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Registro" : "Novo Registro"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-100px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orderNumber">Número do Pedido</Label>
                <Input
                  id="orderNumber"
                  name="orderNumber"
                  defaultValue={initialData?.orderNumber}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={initialData?.name}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                <Input
                  id="cpfCnpj"
                  name="cpfCnpj"
                  defaultValue={initialData?.cpfCnpj}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  defaultValue={initialData?.zipCode}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                name="address"
                defaultValue={initialData?.address}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  name="number"
                  defaultValue={initialData?.number}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  name="bairro"
                  defaultValue={initialData?.bairro}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  name="complement"
                  defaultValue={initialData?.complement}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference">Referência</Label>
                <Input
                  id="reference"
                  name="reference"
                  defaultValue={initialData?.reference}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stateCity">Estado/Cidade</Label>
              <Input
                id="stateCity"
                name="stateCity"
                defaultValue={initialData?.stateCity}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valor">Valor</Label>
                <Input
                  id="valor"
                  name="valor"
                  type="number"
                  step="0.01"
                  defaultValue={initialData?.valor}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  name="status"
                  defaultValue={initialData?.status || "pendente"}
                >
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código</Label>
                <Input
                  id="code"
                  name="code"
                  defaultValue={initialData?.code}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pixCode">Código PIX</Label>
                <Input
                  id="pixCode"
                  name="pixCode"
                  defaultValue={initialData?.pixCode}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qrCodeFile">QR Code (Imagem)</Label>
              <Input
                id="qrCodeFile"
                name="qrCodeFile"
                type="file"
                accept="image/*"
                onChange={handleQrCodeChange}
              />
            </div>

            {qrCodePreview && (
              <div className="flex flex-col items-center space-y-2">
                <Label>Preview do QR Code</Label>
                <div className="relative w-32 h-32">
                  <Image
                    src={qrCodePreview}
                    alt="QR Code Preview"
                    fill
                    className="object-contain"
                    sizes="(max-width: 128px) 100vw, 128px"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
