"use server";

import { UserField, CurrentUserType } from "@/types/authTypes";
import { createClient as createClientServer } from "./server";
import { SupabaseAuthError, SupabaseStorageError } from "@/error/errors";

const defaultFields = [
  "id",
  "email",
  "username",
  "image",
  "bio",
  "created_at",
] satisfies UserField[];

export default async function getCurrentUserServer<
  T extends UserField[] = typeof defaultFields
>(
  fields: T = defaultFields as T
): Promise<Pick<CurrentUserType, T[number]> | null> {
  const supabase = await createClientServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new SupabaseAuthError(error.code || "unknown error", error.message);
  }

  if (!user) {
    throw new Error("User not found");
  }

  const { data, error: selectError } = await supabase
    .from("users")
    .select(fields.join(", "))
    .eq("id", user.id)
    .single();

  if (selectError) {
    throw new SupabaseStorageError(selectError.code, selectError.message);
  }

  return data as unknown as Pick<CurrentUserType, T[number]>;
}
