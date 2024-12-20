import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

export function formatCPFCNPJ(value: string): string {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");

  // CPF
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
  }

  // CNPJ
  return numbers.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
    "$1.$2.$3/$4-$5"
  );
}

export const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
};

export const formatCEP = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{5})(\d{3})/g, '$1-$2');
};

export function isValidCPFCNPJ(value: string): boolean {
  const numbers = value.replace(/\D/g, "");
  return numbers.length === 11 || numbers.length === 14;
}

export function isValidCEP(value: string): boolean {
  const numbers = value.replace(/\D/g, "");
  return numbers.length === 8;
}
