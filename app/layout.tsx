import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/ui/Header/Header";
import { Roboto } from "next/font/google";
import ToastProvider from "@/lib/sonner/ToastProvider";
import SWRProvider from "@/lib/swr/SWRProvider";
import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/constant/api";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://conduit-nextjs.com"
  ),
  title: {
    template: "%s | conduit",
    default: "conduit - 실제 세계의 이야기",
  },
  description: "실제 세계의 다양한 이야기와 정보를 공유하는 커뮤니티입니다.",
  keywords: ["블로그", "커뮤니티", "아티클", "정보 공유"],
  authors: [{ name: "conduit Team" }],
  openGraph: {
    type: "website",
    siteName: "conduit",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "conduit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
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
      userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res) => res.json());
    } catch (error) {
      console.error(error);
      throw new Error("사용자 정보를 불러오는데 실패했습니다.");
    }
  }

  const fallback = {
    [API_ENDPOINTS.CURRENT_USER]: userResponse,
  };

  return (
    <html lang="kr" className={roboto.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var mode = localStorage.getItem('dark-mode-storage');
                  if (mode) {
                    var parsed = JSON.parse(mode);
                    if (parsed.state && parsed.state.isDark) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  } else {
                    // 시스템 설정 확인
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      document.documentElement.classList.add('dark');
                    }
                  }
                } catch (e) {
                  console.error('다크 모드 초기화 오류:', e);
                }
              })();
            `,
          }}
        />
        <body>
          <SWRProvider fallback={fallback}>
            <Header />
            <main className="dark:bg-gray-900 min-h-screen">{children}</main>
            <ToastProvider />
          </SWRProvider>
        </body>
      </head>
    </html>
  );
}
