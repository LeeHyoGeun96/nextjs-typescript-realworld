// 커스텀 에러 클래스들

import { ValidationMessages } from "@/types/authTypes";
import convertAuthSupabaseErrorToKorean from "./convertAuthSupabaseErrorToKorean";
import convertStorageSupabaseErrorToKorean from "./convertStorageSupabaseErrorToKorean";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export class SupabaseAuthError extends Error {
  constructor(public status: number, message: string) {
    super(convertAuthSupabaseErrorToKorean(message));
    this.name = "SupabaseAuthError";
  }
}

export class SupabaseStorageError extends Error {
  constructor(public code: string, message: string) {
    super(convertStorageSupabaseErrorToKorean(message));
    this.name = "SupabaseStorageError";
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
