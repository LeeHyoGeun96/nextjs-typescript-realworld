import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/ui/Header/Header";
import { Roboto } from "next/font/google";
import ToastProvider from "@/lib/sonner/ToastProvider";

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
  return (
    <html lang="kr" className={roboto.variable}>
      <body>
        <Header />
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
