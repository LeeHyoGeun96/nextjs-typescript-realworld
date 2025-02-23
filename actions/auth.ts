"use server";

import {
  LoginState,
  SignupState,
  UpdatePasswordState,
  UpdateProfileState,
} from "@/types/authTypes";
import {
  createDisplayError,
  UnexpectedError,
  ValidationError,
} from "@/types/error";

import { validatePassword, validateSignup } from "@/utils/validations";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// 회원가입
export async function signUp(
  _: SignupState,
  formData: FormData
): Promise<SignupState> {
  try {
    const inputData = {
      email: formData.get("email") as string,
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      passwordConfirm: formData.get("passwordConfirm") as string,
    };

    const fieldErrors = validateSignup(inputData);

    if (fieldErrors) {
      return {
        error: {
          name: "ValidationError",
          fieldErrors: fieldErrors,
        } as ValidationError,
        value: { inputData },
        success: false,
      };
    }

    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: inputData }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: createDisplayError(responseData.error, response.status),
        value: { inputData },
      };
    }
    // 토큰 저장

    return { success: true, value: { inputData } };
  } catch (error) {
    return {
      success: false,
      error: { name: "UnexpectedError", message: (error as Error).message },
      value: {
        inputData: {
          email: "",
          username: "",
          password: "",
          passwordConfirm: "",
        },
      },
    };
  }
}

// 로그인
export async function login(
  _: LoginState,
  formData: FormData
): Promise<LoginState> {
  try {
    const inputData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: inputData }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: createDisplayError(responseData.error, response.status),
        value: { inputData },
      };
    }

    return {
      success: true,
      value: { inputData, token: responseData.user.token },
    };
  } catch (error) {
    return {
      success: false,
      error: { name: "UnexpectedError", message: (error as Error).message },
      value: { inputData: { email: "", password: "" } },
    };
  }
}

// 패스워드 업데이트
export async function updatePassword(
  _: UpdatePasswordState,
  formData: FormData,
  token: string
): Promise<UpdatePasswordState> {
  try {
    const inputData = {
      currentPassword: formData.get("currentPassword") as string,
      password: formData.get("password") as string,
      passwordConfirm: formData.get("passwordConfirm") as string,
    };

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

    const response = await fetch(`${API_URL}/user/password`, {
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
      return {
        success: false,
        error: createDisplayError(responseData.error, response.status),
        value: { inputData },
      };
    }

    return {
      success: true,
      value: { inputData, token: responseData.user.token },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        name: "UnexpectedError",
        message: (error as Error).message || "예상치 못한 에러가 발생했습니다.",
      } as UnexpectedError,
      value: {
        inputData: { currentPassword: "", password: "", passwordConfirm: "" },
      },
    };
  }
}

// 프로필 업데이트
export async function updateProfile(
  _: UpdateProfileState,
  formData: FormData,
  token: string
): Promise<UpdateProfileState> {
  try {
    const inputData = {
      username: formData.get("username") as string,
      bio: formData.get("bio") as string,
    };

    const response = await fetch(`${API_URL}/user`, {
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
      return {
        success: false,
        error: createDisplayError(responseData.error, response.status),
        value: { inputData },
      };
    }

    return {
      success: true,
      value: { inputData, token: responseData.user.token },
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
export async function deleteAccount(token: string, userId: string) {
  try {
    const response = await fetch(`${API_URL}/user`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: { id: userId } }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: createDisplayError(responseData.error, response.status),
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: { name: "UnexpectedError", message: (error as Error).message },
    };
  }
}
