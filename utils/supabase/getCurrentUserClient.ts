import { UserField, CurrentUserType } from "@/types/authTypes";
import { createClient as createClientClient } from "./client";

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
): Promise<Pick<CurrentUserType, T[number]> | undefined> {
  const supabase = createClientClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return undefined;
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw error;
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
    throw selectError;
  }

  return data as unknown as Pick<CurrentUserType, T[number]>;
}
