import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { generateSecureToken } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get("auth_token")?.value;
  const urlTokenCookie = request.cookies.get("url_token")?.value;
  const adminToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN;

  // Se não tiver token admin configurado, bloqueia tudo
  if (!adminToken) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Se tentar acessar com token na URL
  if (pathname.includes("/painel/admin")) {
    const urlSegment = pathname.split("/")[1];

    // Verifica se tem ambos os cookies necessários
    if (!authToken || !urlTokenCookie) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verifica se o token na URL corresponde ao token armazenado no cookie
    if (urlSegment !== urlTokenCookie) {
      return NextResponse.redirect(new URL("/404", request.url));
    }
  }

  // Se tentar acessar /painel/admin diretamente
  if (pathname.startsWith("/painel/admin")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/painel/admin/:path*", "/:token/painel/admin/:path*"],
};
