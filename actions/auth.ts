"use server";

import { AuthState } from "@/types/authTypes";
import { validateSignup } from "@/util/validations";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const serverErrorMessages = (errorMsg: string | undefined) => {
  if (!errorMsg) return { server: "" };
  const newErrors = { server: "" };
  if (errorMsg) {
    switch (errorMsg) {
      case "Invalid login credentials":
        newErrors.server = "이메일 또는 비밀번호가 올바르지 않습니다";
        break;

      case "Too many requests":
        newErrors.server =
          "너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요";
        break;

      case "user_already_exists":
        newErrors.server = "이미 존재하는 이메일입니다";
        break;

      case "same_password":
        newErrors.server =
          "비밀번호를 업데이트하는 사용자는 현재 사용 중인 것과 다른 비밀번호를 사용해야 합니다.";
        break;

      default:
        newErrors.server = "로그인에 실패했습니다";
        break;
    }
  }

  return newErrors;
};

export async function login(_: AuthState, formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    const formattedErrors = serverErrorMessages(error.message);
    return { isValid: false, errors: formattedErrors, values: data };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(_: AuthState, formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    passwordConfirm: formData.get("passwordConfirm") as string,
    username: formData.get("username") as string,
  };

  const { isValid, errors } = validateSignup(data);

  if (!isValid) {
    return { isValid, errors, values: data };
  }

  const { error } = await supabase.auth.signUp(data);

  console.log(error?.code);

  if (error) {
    const formattedErrors = serverErrorMessages(error?.code);
    return { isValid: false, errors: formattedErrors, values: data };
  }

  revalidatePath("/", "page");
  revalidatePath("/profile", "layout");

  redirect("/");
}
