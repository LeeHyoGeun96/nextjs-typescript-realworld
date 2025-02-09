import { ApiError } from "@/types/error";

export type ValidationMessages = Record<string, string>;

export interface SignupState {
  error?: ApiError;
  value: Record<string, string>;
  success?: boolean;
}

export interface LoginState {
  error?: ApiError;
  value: Record<string, string>;
  success?: boolean;
}

export interface PasswordState {
  success?: boolean;
  error?: ApiError;
  value: {
    currentPassword?: string;
    password: string;
    passwordConfirm?: string;
  };
}

export interface ChangeUserInfoState {
  success?: boolean;
  error?: ApiError;
  value: {
    username?: string;
    bio?: string;
  };
}

export type ApiResponse = SignupState | LoginState | PasswordState;

export interface CurrentUserType {
  id: string;
  email: string;
  username: string;
  image?: string;
  created_at: string;
  bio?: string;
}

export type UserField = keyof CurrentUserType;

export interface LoginRequestParams {
  user: {
    email: string;
    password: string;
  };
}

export type LoginDTO = LoginRequestParams;

export type LoginResponse = CurrentUserType;

export interface SignupFormDataType {
  username: string;
  email: string;
  password: string;
}
export interface SignupDTO {
  user: SignupFormDataType;
}

export type SignupRequestParams = SignupFormDataType;

export type SignupResponse = CurrentUserType;

export interface ValidationErrors {
  [key: string]: string[];
}

export interface UpdateUserRequest {
  user: {
    email?: string;
    password?: string;
    username?: string;
    bio?: string;
    image?: string;
  };
}

export type UpdateUserResponse = CurrentUserType;
