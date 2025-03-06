"use client";

import { useActionState } from "react";
import { useRouter } from "@bprogress/next/app";
import { login } from "@/actions/auth";
import { AuthFormWrapper } from "./Common";
import { InputWithError } from "../InputWithError";
import { useUser } from "@/hooks/useUser";

const LoginForm = () => {
  const router = useRouter();
  const { mutate } = useUser();
  const [state, formAction, isPending] = useActionState(login, {
    value: {
      inputData: {
        email: "",
        password: "",
      },
    },
    success: false,
    error: null,
  });

  if (state?.success) {
    router.push("/", { showProgress: true });
    mutate();
  }

  return (
    <AuthFormWrapper
      title="로그인"
      switchText="회원가입이 필요하신가요?"
      switchLink="/register"
      action={formAction}
      error={state.error?.message}
      isPending={isPending}
      clientIsValid={true}
    >
      <InputWithError
        props={{
          type: "email",
          name: "email",
          placeholder: "이메일",
          autoComplete: "email",
          required: true,
          defaultValue: state?.value?.inputData?.email || "",
        }}
      />
      <InputWithError
        props={{
          type: "password",
          name: "password",
          placeholder: "비밀번호",
          autoComplete: "current-password",
          required: true,
        }}
      />
    </AuthFormWrapper>
  );
};

export default LoginForm;
