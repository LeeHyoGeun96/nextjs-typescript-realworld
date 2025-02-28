"use server";

import { cookies } from "next/headers";

export const followUser = async (username: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/profiles/${username}/follow`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error(error);
    throw new Error("팔로우 처리에 실패했습니다.");
  }

  const data = await response.json();

  return data;
};

export const unfollowUser = async (username: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("로그인이 필요합니다.");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/profiles/${username}/follow`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error(error);
    throw new Error("언팔로우 처리에 실패했습니다.");
  }

  return response.json();
};
