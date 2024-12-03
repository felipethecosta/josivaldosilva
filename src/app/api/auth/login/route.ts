import { NextResponse } from "next/server";
import { generateSecureToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN;

    if (!adminToken) {
      return NextResponse.json(
        { error: "Token não configurado" },
        { status: 500 }
      );
    }

    if (password === adminToken) {
      const urlToken = generateSecureToken(adminToken);
      const sessionToken = generateSecureToken(Date.now().toString());

      const response = NextResponse.json({
        success: true,
        token: urlToken,
      });

      // Define o cookie de sessão que expira quando o navegador fecha
      response.cookies.set("auth_token", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        // Não definimos maxAge para que o cookie expire ao fechar o navegador
      });

      // Armazena o token da URL em um cookie separado
      response.cookies.set("url_token", urlToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ error: "Senha inválida" }, { status: 401 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
