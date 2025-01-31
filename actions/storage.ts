"use server";

import getCurrentUserServer from "@/utils/supabase/getCurrentUserServer";
import { createClient } from "@/utils/supabase/server";

export async function updateAvatar(file: File) {
  const supabase = await createClient();
  const user = await getCurrentUserServer(["id"]);

  try {
    // 1. Storage에 이미지 업로드
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("realworldAvtImage")
      .upload(`${user?.id}/avatar.jpg`, file, {
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // 2. 이미지 URL 가져오기
    const {
      data: { publicUrl },
    } = supabase.storage
      .from("realworldAvtImage")
      .getPublicUrl(uploadData.path);

    // 3. 프로필 업데이트
    const { error: updateError } = await supabase
      .from("users")
      .update({ image: publicUrl })
      .eq("id", user?.id);

    if (updateError) throw updateError;

    return publicUrl;
  } catch (error) {
    console.error("Error updating avatar:", error);
    throw error;
  }
}
