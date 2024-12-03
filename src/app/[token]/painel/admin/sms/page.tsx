"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SMSPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [twilioConfig, setTwilioConfig] = useState({
    accountSid: "",
    authToken: "",
    phoneNumber: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numero: phone,
          mensagem: message,
          twilioConfig,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "SMS enviado com sucesso!",
        });
        setPhone("");
        setMessage("");
      } else {
        throw new Error(data.error || "Erro ao enviar SMS");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Erro ao enviar SMS",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/update-twilio-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(twilioConfig),
      });

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Configurações do Twilio atualizadas com sucesso!",
        });
      } else {
        throw new Error("Falha ao atualizar configurações");
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar configurações do Twilio",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar SMS</h1>
      </div>

      <Tabs defaultValue="send" className="space-y-4">
        <TabsList>
          <TabsTrigger value="send">Enviar SMS</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle>Envio de Mensagem</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Número do Destinatário
                  </label>
                  <Input
                    id="phone"
                    placeholder="+5511999999999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Mensagem
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Digite sua mensagem..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="min-h-[100px]"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoading ? "Enviando..." : "Enviar SMS"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Twilio</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleConfigSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="accountSid" className="text-sm font-medium">
                    Account SID
                  </label>
                  <Input
                    id="accountSid"
                    value={twilioConfig.accountSid}
                    onChange={(e) =>
                      setTwilioConfig({
                        ...twilioConfig,
                        accountSid: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="authToken" className="text-sm font-medium">
                    Auth Token
                  </label>
                  <Input
                    id="authToken"
                    type="password"
                    value={twilioConfig.authToken}
                    onChange={(e) =>
                      setTwilioConfig({
                        ...twilioConfig,
                        authToken: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phoneNumber" className="text-sm font-medium">
                    Número do Twilio
                  </label>
                  <Input
                    id="phoneNumber"
                    value={twilioConfig.phoneNumber}
                    onChange={(e) =>
                      setTwilioConfig({
                        ...twilioConfig,
                        phoneNumber: e.target.value,
                      })
                    }
                    placeholder="+17755879150"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Salvar Configurações
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
