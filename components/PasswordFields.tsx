"use client";

import { InputWithError } from "./InputWithError";
import { PasswordStrength } from "./PasswordStrength";
import { ApiResponse, PasswordState } from "@/types/authTypes";
import { useState } from "react";
import { ErrorDisplay } from "./ErrorDisplay";
import { ValidationError } from "@/types/error";

interface IsSamePasswordFieldsProps {
  placeholder?: {
    password: string;
    passwordConfirm: string;
  };
  name?: {
    password: string;
    passwordConfirm: string;
  };
  state: PasswordState | ApiResponse;
}

export function PasswordFields({
  placeholder,
  name,
  state,
}: IsSamePasswordFieldsProps) {
  const [isSamePasswordState, setIsSamePasswordState] = useState({
    error: {
      message: "",
    },
    data: {
      password: "",
      passwordConfirm: "",
    },
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIsSamePasswordState((prev) => ({
      ...prev,
      data: { ...prev.data, [name]: value },
      error:
        prev.data.password === prev.data.passwordConfirm
          ? { message: "" }
          : { message: "비밀번호가 일치하지 않습니다." },
    }));
  };

  return (
    <>
      <fieldset className="mb-4">
        <InputWithError
          errorMessage={
            state.error?.name === "ValidationError"
              ? (state.error as ValidationError).fieldErrors[
                  name?.password || "password"
                ]
              : ""
          }
          props={{
            type: "password",
            name: name?.password || "password",
            placeholder: placeholder?.password || "Password",
            autoComplete: "current-password",
            required: true,
            onChange: handlePasswordChange,
            value: isSamePasswordState.data.password,
          }}
        />
        <PasswordStrength password={state.value.password} />
      </fieldset>
      <fieldset className="mb-4">
        <InputWithError
          errorMessage={
            state.error?.name === "PasswordError" ? state.error.message : ""
          }
          props={{
            type: "password",
            name: name?.passwordConfirm || "passwordConfirm",
            placeholder: placeholder?.passwordConfirm || "Password Confirm",
            required: true,
            onChange: handlePasswordChange,
            value: isSamePasswordState.data.passwordConfirm,
          }}
        />
        <ErrorDisplay message={isSamePasswordState.error.message} />
      </fieldset>
    </>
  );
}
