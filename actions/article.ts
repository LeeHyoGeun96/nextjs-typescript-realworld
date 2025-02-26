"use server";

import { cookies } from "next/headers";

export const favoriteArticle = async (slug: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/articles/${slug}/favorite`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.log(error);
    throw new Error("좋아요 처리에 실패했습니다.");
  }

  return response.json();
};

export const unfavoriteArticle = async (slug: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/articles/${slug}/favorite`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.log(error);
    throw new Error("좋아요 처리에 실패했습니다.");
  }

  return response.json();
};
