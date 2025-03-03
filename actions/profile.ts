"use server";

import { FollowUserState } from "@/types/profileTypes";
import { cookies } from "next/headers";
import { translateError } from "@/error/translateError";

export const followUser = async (
  username: string
): Promise<FollowUserState> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("인증되지 않은 접근입니다.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/profiles/${username}/follow`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        translateError(responseData.errors) || "팔로우 처리에 실패했습니다.";
      throw new Error(errorMessage);
    }

    return {
      success: true,
      value: { responseData: responseData },
    };
  } catch (error) {
    console.error(error);
    throw new Error("팔로우 처리에 실패했습니다.");
  }
};

export const unfollowUser = async (
  username: string
): Promise<FollowUserState> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("인증되지 않은 접근입니다.");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/profiles/${username}/follow`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        translateError(responseData.errors) || "언팔로우 처리에 실패했습니다.";
      throw new Error(errorMessage);
    }

    return {
      success: true,
      value: { responseData: responseData },
    };
  } catch (error) {
    console.error(error);
    throw new Error("언팔로우 처리에 실패했습니다.");
  }
};
