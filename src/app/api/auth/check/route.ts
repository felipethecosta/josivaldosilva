import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const authToken = request.cookies.get("auth_token")?.value;
  const urlToken = request.cookies.get("url_token")?.value;

  if (!authToken || !urlToken) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}
