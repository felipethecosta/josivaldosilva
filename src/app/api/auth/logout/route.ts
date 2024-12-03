import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Remove todos os cookies relacionados à autenticação
  response.cookies.delete("auth_token");
  response.cookies.delete("url_token");

  return response;
}
