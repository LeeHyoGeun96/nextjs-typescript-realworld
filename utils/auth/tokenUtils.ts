"use server";

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

interface JwtPayload {
  id: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

const DEFAULT_MAX_AGE = 60 * 60 * 24 * 60; // 60일

/**
 * JWT 토큰을 저장하고 쿠키를 설정하는 함수
 * @param token JWT 토큰
 */
export async function setAuthToken(token: string): Promise<void> {
  try {
    // 토큰 디코딩
    const decoded = jwtDecode<JwtPayload>(token);

    // 만료 시간 계산 (초 단위)
    const now = Math.floor(Date.now() / 1000);
    const expiryInSeconds = decoded.exp - now;

    // 쿠키 설정
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      maxAge: expiryInSeconds > 0 ? expiryInSeconds : DEFAULT_MAX_AGE,
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
    });
  } catch (error) {
    console.error("토큰 설정 실패:", error);
    // 토큰 디코딩에 실패해도 기본 설정으로 쿠키 저장
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
      maxAge: DEFAULT_MAX_AGE,
    });
  }
}

/**
 * 인증 토큰 제거 함수
 */
export async function removeAuthToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}
