"use client";

import { Button } from "@/components/ui/Button/Button";
import logout from "@/utils/auth/logout";
import { useActionState, useState } from "react";
import { updatePassword } from "@/actions/auth";
import { PasswordState } from "@/types/authTypes";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { InputWithError } from "../InputWithError";
import { ValidationError } from "@/types/error";
import { validatePassword } from "@/utils/validations";
import getErrorMessage from "@/utils/getErrorMessage";
import { useRouter } from "next/navigation";

const initialState: PasswordState = {
  error: undefined,
  value: {
    currentPassword: "",
    password: "",
    passwordConfirm: "",
  },
  success: undefined,
};
export default function SecurityForm() {
  const [state, formAction, isPending] = useActionState(
    updatePassword,
    initialState
  );
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
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

  return (
    <div className="flex gap-8 flex-col">
      <section>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          비밀번호 변경
        </h3>
        <form action={formAction} onSubmit={handleSubmit}>
          <ErrorDisplay message={state.error && getErrorMessage(state.error)} />

          <InputWithError
            props={{
              type: "password",
              name: "currentPassword",
              placeholder: "기존 비밀번호",
              defaultValue: state.value.currentPassword,
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
              defaultValue: state.value.password,
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
              defaultValue: state.value.passwordConfirm,
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
