"use server";

import { createDisplayError } from "@/types/error";
import { createClient } from "@/utils/supabase/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function updateAvatar(file: File, userId: string, token: string) {
  const supabase = await createClient();

  const extension = file.type.split("/")[1];
  const fileName = `avatar.${extension}`; // 또는 원본 파일명 사용

  // 1. Storage에 이미지 업로드
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(`${process.env.NEXT_PUBLIC_STORAGE_BUCKET}`)
    .upload(`${userId}/${fileName}`, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) throw uploadError;

  // 2. 이미지 URL 가져오기
  const {
    data: { publicUrl },
  } = supabase.storage
    .from(`${process.env.NEXT_PUBLIC_STORAGE_BUCKET}`)
    .getPublicUrl(uploadData.path);

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

  if (!response.ok) createDisplayError(responseData.error, response.status);

  return publicUrl;
}

export async function deleteAvatar(userId: string, token: string) {
  const supabase = await createClient();

  const response = await fetch(`${API_URL}/user/image`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const responseData = await response.json();

  if (!response.ok) throw new Error(responseData.error);

  const { data: files, error: listError } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET!)
    .list(userId);

  if (listError) {
    return {
      success: false,
      error: createDisplayError(listError),
    };
  }

  if (files && files.length > 0) {
    const { error: deleteError } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET!)
      .remove([`${userId}/${files[0].name}`]); // 정확한 파일 경로 지정

    if (deleteError) {
      return {
        success: false,
        error: createDisplayError(deleteError),
      };
    }
  }

  return { success: true };
}
