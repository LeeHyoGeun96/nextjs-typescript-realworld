import { ApiError } from "./error";

export type ValidationMessages = Record<string, string>;

export interface SignupState {
  error?: ApiError;
  value: {
    inputData: {
      email: string;
      username: string;
      password: string;
      passwordConfirm: string;
    };
  };
  success?: boolean;
}

export interface LoginState {
  error?: ApiError;
  value: {
    inputData: {
      email: string;
      password: string;
    };
    token?: string;
  };
  success?: boolean;
}

export interface UpdatePasswordState {
  success?: boolean;
  error?: ApiError;
  value: {
    inputData: {
      currentPassword: string;
      password: string;
      passwordConfirm: string;
    };
    token?: string | null;
  };
}

export interface UpdateProfileState {
  success?: boolean;
  error?: ApiError;
  value: {
    inputData: {
      username?: string;
      bio?: string;
    };
    token?: string | null;
  };
}

export interface CurrentUserType {
  id: string;
  email: string;
  username: string;
  bio: string | null;
  image: string | null;
}

export interface ResponseUserType {
  user: CurrentUserType;
}

export type UserField = keyof CurrentUserType;

export interface LoginRequestParams {
  user: {
    email: string;
    password: string;
  };
}
