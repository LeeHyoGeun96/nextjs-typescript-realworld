import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "zlhxeyrnpqvfarblsxzx.supabase.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "iuvvrxiwzvaohvbqylau.supabase.co", // 새로운 Supabase 도메인 추가
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
