"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/actions/auth";
import { AuthFormWrapper } from "./Common";
import { InputWithError } from "../InputWithError";
import { ValidationError } from "@/types/error";
import { validateSignup } from "@/utils/validations";
import { PasswordStrength } from "../PasswordStrength";

const SignupForm = () => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(signUp, {
    error: undefined,
    value: {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
    success: undefined,
  });
  const [isValid, setIsValid] = useState(false);

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
      title="Sign up"
      switchText="Have an account?"
      switchLink="/login"
      onSubmit={handleSubmit}
      action={formAction}
      error={state.error?.message}
      isPending={isPending}
      clientIsValid={isValid}
    >
      <InputWithError
        errorMessage={
          clientErrors["username"] ??
          (state.error?.name === "ValidationError"
            ? (state.error as ValidationError)?.fieldErrors?.username
            : "")
        }
        props={{
          type: "text",
          name: "username",
          placeholder: "Username",
          required: true,
          defaultValue: state?.value?.username || "",
          onChange: handleChange,
        }}
      />
      <InputWithError
        errorMessage={
          clientErrors["email"] ??
          (state.error?.name === "ValidationError"
            ? (state.error as ValidationError)?.fieldErrors?.email
            : "")
        }
        props={{
          type: "email",
          name: "email",
          placeholder: "Email",
          autoComplete: "email",
          required: true,
          defaultValue: state?.value?.email || "",
          onChange: handleChange,
        }}
      />
      <InputWithError
        errorMessage={
          clientErrors["password"] ??
          (state.error?.name === "ValidationError"
            ? (state.error as ValidationError)?.fieldErrors?.password
            : "")
        }
        props={{
          type: "password",
          name: "password",
          placeholder: "Password",
          autoComplete: "new-password",
          required: true,
          defaultValue: state?.value?.password || "",
          onChange: handleChange,
          minLength: 8,
          maxLength: 64,
        }}
      />
      <PasswordStrength password={state?.value?.password || ""} />
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
          placeholder: "Password Confirm",
          autoComplete: "new-password",
          required: true,
          defaultValue: state?.value?.passwordConfirm || "",
          onChange: handleChange,
        }}
      />
    </AuthFormWrapper>
  );
};

export default SignupForm;
