"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/actions/auth";
import { AuthFormWrapper } from "./Common";
import { InputWithError } from "../InputWithError";
import getErrorMessage from "@/utils/getErrorMessage";

const LoginForm = () => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(login, {
    error: undefined,
    value: {
      email: "",
      password: "",
    },
    success: undefined,
  });

  useEffect(() => {
    if (state?.success) {
      router.push("/");
    }
  }, [state?.success, router]);

  return (
    <AuthFormWrapper
      title="Sign in"
      switchText="Need an account?"
      switchLink="/register"
      action={formAction}
      error={state.error && getErrorMessage(state.error)}
      isPending={isPending}
      clientIsValid={true}
    >
      <InputWithError
        props={{
          type: "email",
          name: "email",
          placeholder: "Email",
          autoComplete: "email",
          required: true,
          defaultValue: state?.value?.email || "",
        }}
      />
      <InputWithError
        props={{
          type: "password",
          name: "password",
          placeholder: "Password",
          autoComplete: "current-password",
          required: true,
        }}
      />
    </AuthFormWrapper>
  );
};

export default LoginForm;
