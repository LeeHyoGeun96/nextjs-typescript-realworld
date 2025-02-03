import { UserField, CurrentUserType } from "@/types/authTypes";
import { createClient as createClientClient } from "./client";
import { SupabaseAuthError, SupabaseStorageError } from "@/error/errors";

const defaultFields = [
  "id",
  "email",
  "username",
  "image",
  "bio",
  "created_at",
] satisfies UserField[];

export async function getCurrentUserClient<
  T extends UserField[] = typeof defaultFields
>(
  fields: T = defaultFields as T
): Promise<Pick<CurrentUserType, T[number]> | null> {
  const supabase = createClientClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new SupabaseAuthError(
      error?.status || 500,
      error?.code || "세션 조회 중 알 수 없는 에러"
    );
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
