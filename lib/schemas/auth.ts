import { z } from "zod";
import zxcvbn from "zxcvbn";

const passwordValidation = z
  .string()
  .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
  .max(64, "비밀번호는 최대 64자까지 가능합니다.")
  .refine((password) => {
    const result = zxcvbn(password);
    return result.score >= 3; // zxcvbn 점수 3 이상 요구
  }, "비밀번호가 너무 약합니다. 더 강력한 비밀번호를 사용해주세요.");

export const SignupSchema = z
  .object({
    email: z.string().email("유효한 이메일을 입력해주세요"),
    password: passwordValidation,
    passwordConfirm: z.string({
      required_error: "비밀번호 확인을 입력해주세요",
    }),
    username: z.string().min(2, "사용자 이름은 최소 2자 이상이어야 합니다."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다. 다시 한 번 확인해주세요.",
    path: ["passwordConfirm"],
  });
