import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/ui/Header/Header";
import { Roboto } from "next/font/google";
import ToastProvider from "@/lib/sonner/ToastProvider";
import SWRProvider from "@/lib/swr/SWRProvider";
import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/constant/api";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const roboto = Roboto({
  weight: ["400", "500", "700"], // 필요한 폰트 굵기 선택
  subsets: ["latin"], // 사용할 문자 세트
  display: "swap", // 폰트 로딩 전략
  variable: "--font-roboto",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let userResponse = { user: null };
  if (token) {
    try {
      userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json());
    } catch (error) {
      console.error(error);
      throw new Error("사용자 정보를 불러오는데 실패했습니다.");
    }
  }

  const fallback = {
    [API_ENDPOINTS.CURRENT_USER]: userResponse,
  };

  return (
    <html lang="kr" className={roboto.variable}>
      <body>
        <SWRProvider fallback={fallback}>
          <Header />
          {children}
          <ToastProvider />
        </SWRProvider>
      </body>
    </html>
  );
}
