import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "ui-avatars.com", // 기본 아바타 이미지
      "lh3.googleusercontent.com", // 실제 사용자 이미지 도메인
    ],
  },
};

export default nextConfig;
