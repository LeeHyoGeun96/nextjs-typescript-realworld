import { PROTECTED_ROUTES } from "@/constants/auth";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // createServerClient와 supabase.auth.getUser() 사이에 코드를 작성하지 마세요.
  // 작은 실수로 인해 사용자가 무작위로 로그아웃되는 문제를 디버깅하기 매우 어려울 수 있습니다.

  // 중요: auth.getUser()를 제거하지 마세요.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    PROTECTED_ROUTES.some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 중요: supabaseResponse 객체를 반드시 있는 그대로 반환해야 합니다.
  // 만약 NextResponse.next()로 새로운 응답 객체를 생성하는 경우 다음을 확인하세요:
  // 1. 다음과 같이 request를 전달하세요:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. 다음과 같이 쿠키를 복사하세요:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. myNewResponse 객체를 필요에 맞게 수정하되, 쿠키는 변경하지 마세요!
  // 4. 마지막으로:
  //    return myNewResponse
  // 이 과정을 따르지 않으면 브라우저와 서버가 동기화되지 않아
  // 사용자 세션이 예기치 않게 종료될 수 있습니다!

  return supabaseResponse;
}
