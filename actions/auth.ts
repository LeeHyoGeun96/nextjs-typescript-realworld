"use server";

import convertAuthSupabaseErrorToKorean from "@/error/convertAuthSupabaseErrorToKorean";
import { SupabaseError, ValidationError } from "@/error/errors";
import { LoginState, SignupState } from "@/types/authTypes";
import { validateSignup } from "@/util/validations";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(_: LoginState, formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    const formattedError = convertAuthSupabaseErrorToKorean(error.message);
    return new SupabaseError(error.status!, formattedError);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(_: SignupState, formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    passwordConfirm: formData.get("passwordConfirm") as string,
    username: formData.get("username") as string,
  };

  const messages = validateSignup(data);

  if (messages) {
    return {
      errors: new ValidationError(messages),
      values: data,
    };
  }

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    const formattedErrors = convertAuthSupabaseErrorToKorean(
      error?.code ?? "unknown error"
    );
    return {
      errors: new SupabaseError(error.status!, formattedErrors),
      values: data,
    };
  }

  revalidatePath("/", "page");
  revalidatePath("/profile", "layout");

  redirect("/");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/callback`,
      skipBrowserRedirect: true,
    },
  });

  console.error(error);

  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
}

export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }

  redirect("/");
}
