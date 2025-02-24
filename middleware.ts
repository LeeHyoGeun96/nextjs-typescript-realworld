import { NextRequest, NextResponse } from "next/server";
import { authGuard } from "./utils/auth/middlewareAuthGuard";

export async function middleware(request: NextRequest) {
  // AuthGuard 실행

  const authResult = authGuard(request);
  if (authResult) return authResult;

  // 인증 통과 또는 인증이 필요 없는 경우 요청 계속 진행
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
