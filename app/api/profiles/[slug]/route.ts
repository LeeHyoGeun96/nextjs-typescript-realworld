import { Params } from "@/types/global";
import { NextApiRequest } from "next";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, { params }: { params: Params }) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/api/profiles/${slug}`,
    {
      headers,
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: res.status }
    );
  }

  const data = await res.json();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store", // 항상 최신 데이터를 가져옴
    },
  });
}
