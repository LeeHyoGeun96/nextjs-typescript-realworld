import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getUser = cache(async () => {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return session.user;
});

export const getUserProfile = async () => {
  const user = await getUser(); // 세션 검증 포함

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
};
