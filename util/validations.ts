import { SignupSchema } from "@/lib/schemas/auth";

export const validateSignup = (data: Record<string, unknown>) => {
  const result = SignupSchema.safeParse(data);

  if (result.success) {
    return undefined;
  }

  // 검증 메시지를 필드별로 정리
  const validationMessages: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    const field = err.path[0] as string;
    if (!validationMessages[field]) {
      validationMessages[field] = err.message;
    }
  });

  return { ...validationMessages };
};
