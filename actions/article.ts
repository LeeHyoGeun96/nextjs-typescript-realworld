"use server";

import { createDisplayError, isDisplayError } from "@/types/error";
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

export const addComment = async (body: string, slug: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw createDisplayError("로그인이 필요합니다.");
  }

  if (!body.trim()) {
    throw createDisplayError("댓글을 입력해주세요.");
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/articles/${slug}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comment: { body },
        }),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      console.log(data);
      throw createDisplayError("댓글 작성에 실패했습니다.");
    }

    return data;
  } catch (error) {
    console.error(error);
    throw isDisplayError(error)
      ? error
      : new Error("댓글 작성중에 예상치 못한 에러가 발생하였습니다.");
  }
};

export const deleteComment = async (id: number, slug: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw createDisplayError("로그인이 필요합니다.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/articles/${slug}/comments/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      console.log(data);
      throw createDisplayError("댓글 삭제에 실패했습니다.");
    }
  } catch (e) {
    console.error(e);
    throw isDisplayError(e)
      ? e
      : new Error("댓글 삭제중에 예상치 못한 에러가 발생하였습니다.");
  }
};

export const deleteArticle = async (slug: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw createDisplayError("로그인이 필요합니다.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/articles/${slug}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw createDisplayError("게시글 삭제에 실패했습니다.");
    }

    return true;
  } catch (e) {
    console.error(e);
    throw isDisplayError(e)
      ? e
      : new Error("게시글 삭제중에 예상치 못한 에러가 발생하였습니다.");
  }
};
