// 커스텀 에러 클래스들
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export class SupabaseError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "SupabaseError";
  }
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}
