"use server";

import {
  LoginState,
  SignupState,
  UpdatePasswordState,
  UpdateProfileState,
} from "@/types/authTypes";
import { ValidationError } from "@/types/error";
import { cookies } from "next/headers";

import { validatePassword, validateSignup } from "@/utils/validations";
import { translateError } from "@/error/translateError";
import { removeAuthToken, setAuthToken } from "@/utils/auth/tokenUtils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// 회원가입
export async function signUp(
  _: SignupState,
  formData: FormData
): Promise<SignupState> {
  try {
    const tempInputData = {
      email: formData.get("email")?.toString() || "",
      username: formData.get("username")?.toString() || "",
      password: formData.get("password")?.toString() || "",
      passwordConfirm: formData.get("passwordConfirm")?.toString() || "",
    };

    if (
      !tempInputData.email ||
      !tempInputData.username ||
      !tempInputData.password ||
      !tempInputData.passwordConfirm
    ) {
      return {
        success: false,
        error: new Error("모든 필드를 입력해주세요."),
        value: { inputData: tempInputData },
      };
    }
    const fieldErrors = validateSignup(tempInputData);

    if (fieldErrors) {
      return {
        error: {
          name: "ValidationError",
          fieldErrors: fieldErrors,
        } as ValidationError,
        value: { inputData: tempInputData },
        success: false,
      };
    }

    const response = await fetch(`${API_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: tempInputData }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        translateError(responseData.error) || "회원가입에 실패했습니다.";
      return {
        success: false,
        error: new Error(errorMessage),
        value: { inputData: tempInputData },
      };
    }

    return {
      success: true,
      value: {
        inputData: {
          email: "",
          username: "",
          password: "",
          passwordConfirm: "",
        },
      },
    };
  } catch (error) {
    console.error(error);
    throw new Error("회원가입 도중 예상치 못한 에러가 발생했습니다.");
  }
}

// 로그인
export async function login(
  _: LoginState,
  formData: FormData
): Promise<LoginState> {
  try {
    const inputData = {
      email: formData.get("email")?.toString() || "",
      password: formData.get("password")?.toString() || "",
    };

    if (!inputData.email || !inputData.password) {
      return {
        success: false,
        error: new Error("모든 필드를 입력해주세요."),
        value: { inputData },
      };
    }

    const response = await fetch(`${API_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: inputData }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.log("서버에서 온 에러", responseData);
      const errorMessage =
        translateError(responseData.error) || "로그인에 실패했습니다.";
      return {
        success: false,
        error: new Error(errorMessage),
        value: { inputData },
      };
    }

    await setAuthToken(responseData.user.token);

    return {
      success: true,
      value: { inputData },
    };
  } catch (error) {
    console.error(error);
    throw new Error("로그인 도중 예상치 못한 에러가 발생했습니다.");
  }
}

// 패스워드 업데이트
export async function updatePassword(
  _: UpdatePasswordState,
  formData: FormData
): Promise<UpdatePasswordState> {
  try {
    const inputData = {
      currentPassword: formData.get("currentPassword")?.toString() || "",
      password: formData.get("password")?.toString() || "",
      passwordConfirm: formData.get("passwordConfirm")?.toString() || "",
    };

    if (
      !inputData.currentPassword ||
      !inputData.password ||
      !inputData.passwordConfirm
    ) {
      return {
        success: false,
        error: new Error("모든 필드를 입력해주세요."),
        value: { inputData },
      };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("인증되지 않은 접근입니다.");
    }

    const fieldErrors = validatePassword(inputData);

    if (fieldErrors) {
      return {
        success: false,
        error: {
          name: "ValidationError",
          fieldErrors: fieldErrors,
        } as ValidationError,
        value: { inputData },
      };
    }

    const response = await fetch(`${API_URL}/api/user/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user: {
          inputCurrentPassword: inputData.currentPassword,
          password: inputData.password,
        },
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        translateError(responseData.error) ||
        "패스워드 업데이트에 실패했습니다.";
      return {
        success: false,
        error: new Error(errorMessage),
        value: { inputData },
      };
    }

    await setAuthToken(responseData.user.token);

    return {
      success: true,
      value: {
        inputData: { currentPassword: "", password: "", passwordConfirm: "" },
      },
    };
  } catch (error) {
    console.error(error);
    throw new Error("패스워드 업데이트 도중 예상치 못한 에러가 발생했습니다.");
  }
}

// 프로필 업데이트
export async function updateProfile(
  formData: FormData
): Promise<UpdateProfileState> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("인증되지 않은 접근입니다.");
    }

    const inputData = {
      username: formData.get("username")?.toString() || "",
      bio: formData.get("bio")?.toString() || "",
    };

    if (!inputData.username) {
      return {
        success: false,
        error: new Error("사용자 이름을 입력해주세요."),
        value: { inputData },
      };
    }

    const response = await fetch(`${API_URL}/api/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user: {
          username: formData.get("username"),
          bio: formData.get("bio"),
        },
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        translateError(responseData.error) || "프로필 업데이트에 실패했습니다.";
      return {
        success: false,
        error: new Error(errorMessage),
        value: { inputData },
      };
    }

    await setAuthToken(responseData.user.token);
    return {
      success: true,
      value: { inputData },
    };
  } catch (error) {
    return {
      success: false,
      error: { name: "UnexpectedError", message: (error as Error).message },
      value: { inputData: { username: "", bio: "" } },
    };
  }
}
// 회원 탈퇴
export async function deleteAccount(userId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("인증되지 않은 접근입니다.");
    }

    const response = await fetch(`${API_URL}/api/user`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: { id: userId } }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage =
        translateError(responseData.error) || "회원 탈퇴에 실패했습니다.";
      return {
        success: false,
        error: new Error(errorMessage),
      };
    }
    await logout();

    return { success: true };
  } catch (error) {
    console.error(error);
    throw new Error("회원 탈퇴 도중 예상치 못한 에러가 발생했습니다.");
  }
}

export const logout = async () => {
  await removeAuthToken();
};
