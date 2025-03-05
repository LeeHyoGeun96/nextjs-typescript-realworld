"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/actions/auth";
import { AuthFormWrapper } from "./Common";
import { InputWithError } from "../InputWithError";
import { ValidationError } from "@/types/error";
import { validateSignup } from "@/utils/validations";
import { PasswordStrengthBar } from "../PasswordStrengthBar";

const SignupForm = () => {
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(signUp, {
    value: {
      inputData: {
        username: "",
        email: "",
        password: "",
        passwordConfirm: "",
      },
    },
    success: false,
  });

  const [isValid, setIsValid] = useState(false);
  const [isSubmited, setIsSubmited] = useState(false);

  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData(e.currentTarget.form!);
    const values = Object.fromEntries(formData) as Record<string, string>;

    const errors = validateSignup(values);

    if (errors) {
      setClientErrors(errors);
      setIsValid(false);
    } else {
      setClientErrors({});
      setIsValid(true);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmited(true);
    if (!isValid) {
      e.preventDefault(); // ❌ 클라이언트 벨리데이션 실패 시, 폼 제출 차단
    }
  };

  useEffect(() => {
    if (state?.success) {
      router.push("/login");
    }
  }, [state?.success, router]);

  return (
    <AuthFormWrapper
      title="회원가입"
      switchText="이미 계정이 있으신가요?"
      switchLink="/login"
      onSubmit={handleSubmit}
      action={formAction}
      error={state.error?.message}
      isPending={isPending}
      clientIsValid={true}
    >
      <InputWithError
        errorMessage={
          isSubmited && clientErrors["username"]
            ? clientErrors["username"]
            : state.error?.name === "ValidationError"
            ? (state.error as ValidationError)?.fieldErrors?.username
            : ""
        }
        props={{
          type: "text",
          name: "username",
          placeholder: "닉네임",
          required: true,
          defaultValue: state?.value?.inputData?.username || "",
          onChange: handleChange,
        }}
      />
      <InputWithError
        errorMessage={
          isSubmited && clientErrors["email"]
            ? clientErrors["email"]
            : state.error?.name === "ValidationError"
            ? (state.error as ValidationError)?.fieldErrors?.email
            : ""
        }
        props={{
          type: "email",
          name: "email",
          placeholder: "이메일",
          autoComplete: "email",
          required: true,
          defaultValue: state?.value?.inputData?.email || "",
          onChange: handleChange,
        }}
      />
      <InputWithError
        errorMessage={
          clientErrors["password"]
            ? clientErrors["password"]
            : state.error?.name === "ValidationError"
            ? (state.error as ValidationError)?.fieldErrors?.password
            : ""
        }
        props={{
          type: "password",
          name: "password",
          placeholder: "비밀번호",
          autoComplete: "new-password",
          required: true,
          defaultValue: state?.value?.inputData?.password || "",
          onChange: handleChange,
          minLength: 8,
          maxLength: 64,
          ref: passwordRef,
        }}
      />
      <PasswordStrengthBar password={passwordRef.current?.value || ""} />
      <InputWithError
        errorMessage={
          clientErrors["passwordConfirm"] ??
          (state.error?.name === "ValidationError"
            ? (state.error as ValidationError)?.fieldErrors?.passwordConfirm
            : "")
        }
        props={{
          type: "password",
          name: "passwordConfirm",
          placeholder: "비밀번호 확인",
          autoComplete: "new-password",
          required: true,
          defaultValue: state?.value?.inputData?.passwordConfirm || "",
          onChange: handleChange,
        }}
      />
    </AuthFormWrapper>
  );
};

export default SignupForm;
