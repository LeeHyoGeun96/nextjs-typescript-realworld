"use server";

import { UserField, CurrentUserType } from "@/types/authTypes";
import { createClient as createClientServer } from "./server";

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
>(fields: T = defaultFields as T): Promise<Pick<CurrentUserType, T[number]>> {
  const supabase = await createClientServer();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (!session) {
    throw new Error("세션이 없습니다.");
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  if (!user) {
    throw new Error("유저가 없습니다.");
  }

  const { data, error: selectError } = await supabase
    .from("users")
    .select(fields.join(", "))
    .eq("id", user.id)
    .single();

  if (selectError) {
    throw selectError;
  }

  return data as unknown as Pick<CurrentUserType, T[number]>;
}
