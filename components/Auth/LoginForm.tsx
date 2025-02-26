"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/actions/auth";
import { AuthFormWrapper } from "./Common";
import { InputWithError } from "../InputWithError";
import { useUser } from "@/hooks/useUser";

const LoginForm = () => {
  const router = useRouter();
  const { mutate } = useUser();
  const [state, formAction, isPending] = useActionState(login, {
    error: undefined,
    value: {
      inputData: {
        email: "",
        password: "",
      },
      token: "",
    },
    success: undefined,
  });

  useEffect(() => {
    if (state?.success) {
      router.push("/");
      mutate();
    }
  }, [state?.success, router, state?.value.token, mutate]);

  return (
    <AuthFormWrapper
      title="Sign in"
      switchText="Need an account?"
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
          placeholder: "Email",
          autoComplete: "email",
          required: true,
          defaultValue: state?.value?.inputData?.email || "",
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
