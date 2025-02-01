import { PasswordError, SupabaseError, ValidationError } from "@/error/errors";

export type ValidationMessages = Record<string, string>;

export interface SignupState {
  error?: SupabaseError | ValidationError;
  value: Record<string, string>;
  success?: boolean;
}

export interface LoginState {
  error?: SupabaseError;
  value: Record<string, string>;
  success?: boolean;
}

export interface PasswordState {
  error?: PasswordError;
  values: {
    password: string;
    passwordConfirm: string;
  };
}

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
