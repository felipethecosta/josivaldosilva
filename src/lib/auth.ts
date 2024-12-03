import { createHash } from "crypto";

// Função para gerar um hash seguro do token
export function generateSecureToken(password: string): string {
  return createHash("sha256").update(password).digest("base64url").slice(0, 32);
}

// Função para validar o token
export function validateAdminPassword(password: string): boolean {
  return password === process.env.NEXT_PUBLIC_ADMIN_TOKEN;
}
