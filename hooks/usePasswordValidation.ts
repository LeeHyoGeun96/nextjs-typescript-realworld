import { useState } from "react";
import { PasswordState } from "@/types/authTypes";
import { PasswordError } from "@/error/errors";

interface UsePasswordValidationProps {
  isLoginForm?: boolean;
}

export function usePasswordValidation({
  isLoginForm = false,
}: UsePasswordValidationProps) {
  const [passwordState, setPasswordState] = useState<PasswordState>({
    error: undefined,
    values: {
      password: "",
      passwordConfirm: "",
    },
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPasswordState((prev) => {
      const newState = { ...prev, values: { ...prev.values, [name]: value } };

      if (
        !isLoginForm &&
        ((name === "password" && prev.values.passwordConfirm) ||
          (name === "passwordConfirm" && prev.values.password))
      ) {
        return {
          ...newState,
          error:
            newState.values.password !== newState.values.passwordConfirm
              ? new PasswordError("비밀번호가 일치하지 않습니다")
              : undefined,
        };
      }

      return newState;
    });
  };

  return {
    passwordState,
    handlePasswordChange,
  };
}
