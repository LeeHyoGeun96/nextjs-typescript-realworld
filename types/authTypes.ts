import { ActionState } from "./global";
import { ProfileResponse } from "./profileTypes";

export type ValidationMessages = Record<string, string>;

export type SignupState = ActionState<{
  inputData: {
    email: string;
    username: string;
    password: string;
    passwordConfirm: string;
  };
}>;

export type LoginState = ActionState<{
  inputData: {
    email: string;
    password: string;
  };
}>;

export type UpdatePasswordState = ActionState<{
  inputData: {
    currentPassword: string;
    password: string;
    passwordConfirm: string;
  };
}>;

export type UpdateProfileState = ActionState<{
  inputData: {
    username: string;
    bio?: string;
  };
  responseData?: ProfileResponse;
}>;

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
