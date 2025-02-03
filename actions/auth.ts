"use server";

import { ApiError, SupabaseAuthError, ValidationError } from "@/error/errors";
import { LoginState, SignupState } from "@/types/authTypes";
import { validateSignup } from "@/util/validations";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function login(_: LoginState, formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return {
      error: new SupabaseAuthError(
        error.status || 500,
        error.code || "unknown error"
      ),
      value: data,
    };
  }

  return {
    success: true,
    value: data,
    error: undefined,
  };
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
      error: new ValidationError(messages),
      value: data,
      success: false,
    };
  }

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        display_name: data.username,
      },
    },
  });

  if (error) {
    return {
      error: new SupabaseAuthError(
        error.status || 500,
        error.code || "unknown error"
      ),
      value: data,
      success: false,
    };
  }

  return {
    success: true,
    value: data,
    error: undefined,
  };
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

  if (error) {
    console.error(error);
    throw new ApiError(error.status!, error.message);
  }

  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
}
