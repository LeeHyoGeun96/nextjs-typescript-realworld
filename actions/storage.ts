"use server";

import getCurrentUserServer from "@/utils/supabase/getCurrentUserServer";
import { createClient } from "@/utils/supabase/server";

export async function updateAvatar(file: File) {
  const supabase = await createClient();
  const userData = await getCurrentUserServer(["id"]);

  if (!userData?.id) {
    throw new Error("로그인이 필요합니다.");
  }

  const userId = userData.id;
  // 1. Storage에 이미지 업로드
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("realworldAvtImage")
    .upload(`${userId}/avatar.jpg`, file, {
      upsert: true,
    });

  if (uploadError) throw uploadError;

  // 2. 이미지 URL 가져오기
  const {
    data: { publicUrl },
  } = supabase.storage.from("realworldAvtImage").getPublicUrl(uploadData.path);

  // 3. 프로필 업데이트
  const { error: updateError } = await supabase
    .from("users")
    .update({ image: publicUrl })
    .eq("id", userId);

  if (updateError) throw updateError;

  return publicUrl;
}

export async function deleteAvatar() {
  const supabase = await createClient();
  const userData = await getCurrentUserServer(["id"]);

  if (!userData?.id) {
    throw new Error("로그인이 필요합니다.");
  }

  const userId = userData.id;

  const { error: deleteError } = await supabase.storage
    .from("realworldAvtImage")
    .remove([`${userId}/avatar.jpg`]);

  if (deleteError) {
    return {
      success: false,
      error: deleteError,
    };
  }

  return { success: true };
}
