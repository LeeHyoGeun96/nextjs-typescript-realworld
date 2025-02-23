"use client";

import { Button } from "@/components/ui/Button/Button";
import logout from "@/utils/auth/authUtils";
import { useActionState, useEffect, useState } from "react";
import { updatePassword } from "@/actions/auth";
import { UpdatePasswordState } from "@/types/authTypes";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { InputWithError } from "../InputWithError";
import {
  createDisplayError,
  isDisplayError,
  ValidationError,
} from "@/types/error";
import { validatePassword } from "@/utils/validations";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/zustand/authStore";

const initialState: UpdatePasswordState = {
  error: undefined,
  value: {
    inputData: {
      currentPassword: "",
      password: "",
      passwordConfirm: "",
    },
    token: null,
  },
  success: undefined,
};

export default function SecurityForm() {
  const { token, setToken } = useAuthStore((state) => state);

  const updatePasswordWithToken = async (
    state: UpdatePasswordState,
    formData: FormData
  ) => {
    if (!token) {
      return {
        success: false,
        error: createDisplayError("토큰이 존재하지 않습니다."),
        value: state.value,
      };
    }

    // token을 updatePassword에 인자로 전달
    const result = await updatePassword(state, formData, token);

    if (result.success) {
      setToken(result.value.token!);
    }

    return result;
  };

  const [state, formAction, isPending] = useActionState(
    updatePasswordWithToken,
    initialState
  );

  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [displayError, setDisplayError] = useState<string | undefined>(
    undefined
  );
  const [unexpectedError, setUnexpectedError] = useState<string | undefined>(
    undefined
  );
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData(e.currentTarget.form!);
    const values = Object.fromEntries(formData) as Record<string, string>;

    const errors = validatePassword(values);

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
      e.preventDefault();
    }
  };

  const handleDeleteUser = () => {
    router.push("/settings/deleteUser", {
      scroll: false,
    });
  };

  useEffect(() => {
    if (state.error) {
      if (isDisplayError(state.error)) {
        setDisplayError(state.error.message);
      } else {
        setUnexpectedError(state.error.message);
      }
    }
  }, [state.error]);

  if (unexpectedError) {
    throw new Error(unexpectedError);
  }

  return (
    <div className="flex gap-8 flex-col">
      <section>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          비밀번호 변경
        </h3>
        <form action={formAction} onSubmit={handleSubmit}>
          <ErrorDisplay message={displayError} />

          <InputWithError
            props={{
              type: "password",
              name: "currentPassword",
              placeholder: "기존 비밀번호",
              defaultValue: state.value.inputData.currentPassword,
              onChange: handleChange,
            }}
            className="mb-4"
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
              placeholder: "새로운 비밀번호",
              defaultValue: state.value.inputData.password,
              onChange: handleChange,
            }}
            className="mb-4"
          />
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
              placeholder: "새로운 비밀번호 확인",
              defaultValue: state.value.inputData.passwordConfirm,
              onChange: handleChange,
            }}
            className="mb-4"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isPending || !isValid}
            >
              패스워드 수정하기
            </Button>
          </div>
        </form>
      </section>

      <section className="flex gap-4 flex-col">
        <Button
          variant="outline-danger"
          className="w-full"
          size="lg"
          onClick={logout}
        >
          로그아웃
        </Button>
        <Button
          variant="outline-danger"
          className="w-full"
          size="lg"
          onClick={handleDeleteUser}
        >
          회원탈퇴
        </Button>
      </section>
    </div>
  );
}
