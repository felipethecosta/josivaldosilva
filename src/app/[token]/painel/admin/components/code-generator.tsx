"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
// import { useToast } from "@/components/ui/use-toast";

const generateCode = () => {
  const year = "2024";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomLetters = "";

  for (let i = 0; i < 4; i++) {
    randomLetters += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  return `${year}${randomLetters}`;
};

export function CodeGenerator() {
  const [code, setCode] = useState("2024XXXX");
  const { toast } = useToast();

  useEffect(() => {
    setCode(generateCode());
  }, []);

  const handleGenerateNew = () => {
    setCode(generateCode());
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Código copiado!",
      description: "O código foi copiado para a área de transferência.",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Gerador de Código</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="text-4xl font-mono bg-secondary p-4 rounded-md w-full text-center">
          {code}
        </div>
        <div className="flex space-x-2">
          <Button variant="default" onClick={handleGenerateNew}>
            Gerar Novo
          </Button>
          <Button variant="secondary" onClick={handleCopyClick}>
            Copiar Código
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
