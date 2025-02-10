"use client";

import { mutate } from "swr";
import { createClient } from "../supabase/client";

export default async function logout() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return error;
  }

  await mutate("/api/user", null, false);
  window.location.href = "/";
}
