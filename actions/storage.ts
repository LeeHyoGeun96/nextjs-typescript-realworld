"use server";

import { COOKIE_OPTIONS } from "@/constant/auth";
import { translateError } from "@/error/translateError";
import { deleteAvatarState, updateAvatarState } from "@/types/profileTypes";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function updateAvatar(
  file: File,
  userId: string
): Promise<updateAvatarState> {
  try {
    const supabase = await createClient();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("인증되지 않은 접근입니다.");
    }

    const extension = file.type.split("/")[1];
    const fileName = `avatar.${extension}`; // 또는 원본 파일명 사용

    // 1. Storage에 이미지 업로드
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(`${process.env.NEXT_PUBLIC_STORAGE_BUCKET}`)
      .upload(`${userId}/${fileName}`, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      console.error(uploadError);
      return {
        success: false,
        error: new Error("프로필 이미지 업데이트에 실패했습니다."),
      };
    }

    // 2. 이미지 URL 가져오기
    const {
      data: { publicUrl },
    } = supabase.storage
      .from(`${process.env.NEXT_PUBLIC_STORAGE_BUCKET}`)
      .getPublicUrl(uploadData.path);

    if (!publicUrl) {
      console.error("이미지 URL 가져오기에 실패했습니다.");
      return {
        success: false,
        error: new Error("프로필 이미지 업데이트에 실패했습니다."),
      };
    }

    // 3. 프로필 업데이트
    const response = await fetch(`${API_URL}/user/image`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user: {
          image: publicUrl,
        },
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error(responseData.error);
      const message =
        translateError(responseData.error) ||
        "프로필 이미지 업데이트에 실패했습니다.";
      throw new Error(message);
    }

    cookieStore.set("token", responseData.user.token, COOKIE_OPTIONS);

    return {
      success: true,
      value: { publicUrl: publicUrl },
    };
  } catch (error) {
    console.error(error);
    throw new Error("프로필 이미지 업데이트에 실패했습니다.");
  }
}

export async function deleteAvatar(userId: string): Promise<deleteAvatarState> {
  try {
    const supabase = await createClient();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("인증되지 않은 접근입니다.");
    }

    const response = await fetch(`${API_URL}/user/image`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error(responseData.error);
      const message =
        translateError(responseData.error) ||
        "프로필 이미지 삭제에 실패했습니다.";
      throw new Error(message);
    }

    const { data: files, error: listError } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET!)
      .list(userId);

    if (listError) {
      console.error(listError);
      return {
        success: false,
        error: new Error("프로필 이미지 삭제에 실패했습니다."),
      };
    }

    if (files && files.length > 0) {
      const { error: deleteError } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET!)
        .remove([`${userId}/${files[0].name}`]); // 정확한 파일 경로 지정

      if (deleteError) {
        console.error(deleteError);
        return {
          success: false,
          error: new Error("프로필 이미지 삭제에 실패했습니다."),
        };
      }
    }

    cookieStore.set("token", responseData.token, COOKIE_OPTIONS);

    return { success: true };
  } catch (error) {
    console.error(error);
    throw new Error("프로필 이미지 삭제에 실패했습니다.");
  }
}
