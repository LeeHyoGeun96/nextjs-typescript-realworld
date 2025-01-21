import { SignupSchema } from "@/lib/schemas/auth";

export const validateSignup = (data: Record<string, unknown>) => {
  const result = SignupSchema.safeParse(data);

  if (result.success) {
    return { isValid: true, errors: {} };
  }

  // 에러를 필드별로 정리
  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    const field = err.path[0] as string;
    if (!errors[field]) {
      errors[field] = err.message;
    }
  });

  return { isValid: false, errors };
};
