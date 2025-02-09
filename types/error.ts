import { AuthError } from "@supabase/supabase-js";

export interface ValidationError extends Error {
  name: "ValidationError";
  fieldErrors: Record<string, string>;
}

export function isValidationError(error: ApiError): error is ValidationError {
  return error.name === "ValidationError";
}

export function isAuthError(error: ApiError): error is AuthError {
  return error.name === "AuthError";
}

export type ApiError = ValidationError | AuthError;
