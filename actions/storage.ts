"use server";

import { SupabaseStorageError } from "@/error/errors";
import getCurrentUserServer from "@/utils/supabase/getCurrentUserServer";
import { createClient } from "@/utils/supabase/server";

export async function updateAvatar(file: File) {
  const supabase = await createClient();
  const user = await getCurrentUserServer(["id"]);

  // 1. Storage에 이미지 업로드
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("realworldAvtImage")
    .upload(`${user?.id}/avatar.jpg`, file, {
      upsert: true,
    });

  if (uploadError)
    throw new SupabaseStorageError("unknown error", uploadError.message);

  // 2. 이미지 URL 가져오기
  const {
    data: { publicUrl },
  } = supabase.storage.from("realworldAvtImage").getPublicUrl(uploadData.path);

  // 3. 프로필 업데이트
  const { error: updateError } = await supabase
    .from("users")
    .update({ image: publicUrl })
    .eq("id", user?.id);

  if (updateError)
    throw new SupabaseStorageError(
      "unknown error",
      updateError.message || "아바타 업데이트 중 알 수 없는 에러"
    );

  return publicUrl;
}

export async function deleteAvatar() {
  const supabase = await createClient();
  const user = await getCurrentUserServer(["id"]);

  const { error: deleteError } = await supabase.storage
    .from("realworldAvtImage")
    .remove([`${user?.id}/avatar.jpg`]);

  if (deleteError)
    throw new SupabaseStorageError(
      "unknown error",
      deleteError.message || "아바타 삭제 중 알 수 없는 에러"
    );

  return { success: true };
}
