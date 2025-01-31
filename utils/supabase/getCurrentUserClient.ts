import { UserField } from "@/types/authTypes";
import { User } from "@/types/authTypes";
import { createClient as createClientClient } from "./client";

export async function getCurrentUserClient<T extends UserField[]>(
  fields: [...T]
): Promise<Pick<User, T[number]> | null> {
  const supabase = createClientClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    const { data } = await supabase
      .from("users")
      .select(fields.join(", "))
      .eq("id", user.id)
      .single();

    // data의 타입을 명시적으로 지정
    if (!data) return null;

    // 타입 캐스팅을 한번만 수행
    return data as unknown as Pick<User, T[number]>;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}
