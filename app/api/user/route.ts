import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/user", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return new NextResponse(JSON.stringify(data), {
    headers: {
      "Cache-Control": "no-store", // 항상 최신 데이터를 가져옴
    },
  });
}
