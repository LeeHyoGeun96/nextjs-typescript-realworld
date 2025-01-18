export interface AuthState {
  isValid: boolean;
  errors: Record<string, string>;
  values: Record<string, string>;
}

export interface CurrentUserType {
  user: {
    email: string;
    token: string;
    username: string;
    bio: string;
    image?: string;
  };
}

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
