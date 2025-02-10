"use server";

import {
  ChangeUserInfoState,
  LoginState,
  SignupState,
} from "@/types/authTypes";
import { validatePassword, validateSignup } from "@/utils/validations";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ValidationError } from "@/types/error";
import { AuthError } from "@supabase/supabase-js";
import getCurrentUserServer from "@/utils/supabase/getCurrentUserServer";
import { createClientAdmin } from "@/utils/supabase/serverAdmin";

export async function login(
  _: LoginState,
  formData: FormData
): Promise<LoginState> {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return {
      success: false,
      error: {
        name: "AuthError",
        message: error.message,
        code: error.code,
      } as AuthError,
      value: data,
    };
  }

  return {
    success: true,
    value: data,
    error: undefined,
  };
}

export async function signup(
  _: SignupState,
  formData: FormData
): Promise<SignupState> {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    passwordConfirm: formData.get("passwordConfirm") as string,
    username: formData.get("username") as string,
  };

  const fieldErrors = validateSignup(data);

  if (fieldErrors) {
    return {
      error: {
        name: "ValidationError",
        fieldErrors: fieldErrors,
      } as ValidationError,
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
      error: {
        name: "AuthError",
        message: error.message,
        code: error.code,
      } as AuthError,
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
    throw error;
  }

  if (data.url) {
    redirect(data.url); // use the redirect API for your server framework
  }
}

export async function updatePassword(_: unknown, formData: FormData) {
  const supabase = await createClient();
  const userData = await getCurrentUserServer(["id"]);

  const data = {
    currentPassword: formData.get("currentPassword") as string,
    password: formData.get("password") as string,
    passwordConfirm: formData.get("passwordConfirm") as string,
  };

  if (!userData?.id) {
    return {
      success: false,
      error: {
        name: "AuthError",
        message: "로그인이 필요합니다.",
      } as AuthError,
      value: data,
    };
  }

  const userId = userData.id;

  const fieldErrors = validatePassword(data);

  if (fieldErrors) {
    return {
      error: {
        name: "ValidationError",
        fieldErrors: fieldErrors,
      } as ValidationError,
      value: data,
      success: false,
    };
  }

  const { data: verifyData, error: verifyError } = await supabase.rpc(
    "verify_user_password",
    {
      user_id: userId,
      password: data.currentPassword,
    }
  );

  if (verifyError) throw verifyError;

  if (!verifyData) {
    return {
      success: false,
      error: {
        name: "AuthError",
        message: "현재 비밀번호가 잘못되었습니다.",
      } as AuthError,
      value: data,
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: data.password,
  });

  if (error) {
    return {
      success: false,
      error: {
        name: "AuthError",
        message: error.message,
        code: error.code,
      } as AuthError,
      value: data,
    };
  }

  return {
    success: true,
    value: {
      currentPassword: "",
      password: "",
      passwordConfirm: "",
    },
    error: undefined,
  };
}

export async function ChangeUserInfo(
  _: ChangeUserInfoState,
  formData: FormData
) {
  const supabase = await createClient();
  const userData = await getCurrentUserServer(["id"]);

  const data = {
    username: formData.get("username") as string,
    bio: formData.get("bio") as string,
  };

  if (!userData?.id) {
    return {
      success: false,
      error: {
        name: "AuthError",
        message: "로그인이 필요합니다.",
      } as AuthError,
      value: data,
    };
  }

  const userId = userData.id;

  const { error } = await supabase
    .from("users")
    .update({ username: data.username, bio: data.bio })
    .eq("id", userId)
    .select();

  if (error) {
    return {
      success: false,
      error: {
        name: "AuthError",
        message: "프로필 수정에 실패했습니다.",
      } as AuthError,
      value: data,
    };
  }

  return {
    success: true,
    value: data,
    error: undefined,
  };
}

export async function deleteUser() {
  const supabase = await createClientAdmin();
  const userData = await getCurrentUserServer(["id"]);

  if (!userData?.id) {
    throw new Error("로그인이 필요합니다.");
  }

  // 1. 먼저 스토리지의 파일 삭제
  const { error: objectsError } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME!)
    .remove([`${userData.id}/avatar.jpg`]);

  if (objectsError && objectsError.message !== "The resource was not found") {
    throw objectsError;
  }

  // 2. users 테이블의 데이터 삭제
  const { error: userDataError } = await supabase
    .from("users")
    .delete()
    .eq("id", userData.id);

  if (userDataError) {
    throw userDataError;
  }

  // 3. 마지막으로 auth.users에서 사용자 삭제
  const { error } = await supabase.auth.admin.deleteUser(userData.id);

  if (error) {
    return {
      success: false,
      error: {
        name: "AuthError",
        message: error.message,
        code: error.code,
      } as AuthError,
    };
  }

  return {
    success: true,
    error: undefined,
  };
}
