// utils/authGuard.ts

import { PROTECTED_ROUTES } from "@/constant/auth";
import { NextRequest, NextResponse } from "next/server";

export function authGuard(request: NextRequest) {
  const isProtectedPath = PROTECTED_ROUTES.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath) {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 인증이 필요 없거나 인증된 경우 null 반환
  return null;
}
