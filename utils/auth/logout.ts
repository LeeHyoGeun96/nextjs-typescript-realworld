"use client";

import { mutate } from "swr";
import { createClient } from "../supabase/client";
import { SupabaseError } from "@/error/errors";

export default async function logout() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new SupabaseError(error.status!, error.message);
  }

  await mutate("/api/user", null, false);
  window.location.href = "/";
}
