import { createClient } from "./server";

export default async function getIsLoggedIn(): Promise<boolean> {
  const supabase = await createClient();

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session) {
      return false;
    }

    return true;
  } catch (error: unknown) {
    throw new Error(`Auth error: ${error}`);
  }
}
