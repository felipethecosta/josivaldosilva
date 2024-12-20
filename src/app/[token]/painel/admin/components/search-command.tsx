"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"

interface SearchCommandProps {
  onFilter: (filter: string) => void;
  className?: string;
}

export function SearchCommand({ onFilter, className }: SearchCommandProps) {
  return (
    <div className={className}>
      <Input
        placeholder="Buscar por nome, código ou CPF/CNPJ..."
        onChange={(e) => onFilter(e.target.value)}
        className="w-full"
      />
    </div>
  )
}

