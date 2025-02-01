// 커스텀 에러 클래스들

import { ValidationMessages } from "@/types/authTypes";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export class SupabaseError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "SupabaseError";
  }
}

export class ValidationError extends Error {
  constructor(public fieldErrors: ValidationMessages) {
    super(Object.values(fieldErrors)[0]);
    this.name = "ValidationError";
  }
}

export class PasswordError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = "PasswordError";
  }
}
