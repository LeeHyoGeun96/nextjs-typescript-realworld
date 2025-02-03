"use client";

import { mutate } from "swr";
import { createClient } from "../supabase/client";
import { SupabaseAuthError } from "@/error/errors";

export default async function logout() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new SupabaseAuthError(error.status!, error.code || "unknown error");
  }

  await mutate("/api/user", null, false);
  window.location.href = "/";
}
