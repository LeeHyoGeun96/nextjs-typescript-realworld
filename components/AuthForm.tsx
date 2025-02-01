"use client";

import Link from "next/link";

import { useActionState, useState } from "react";
import { LoginState, PasswordState, SignupState } from "@/types/authTypes";
import { PasswordStrength } from "./PasswordStrength";
import { ValidationInput } from "./ValidationInput";
import { ErrorDisplay } from "./ErrorDisplay";
import GoogleLoginBtn from "./GoogleLoginBtn";
import { PasswordError } from "@/error/errors";

interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (
    prevState: LoginState | SignupState,
    data: FormData
  ) => Promise<LoginState | SignupState>;
}

const initialState: LoginState | SignupState = {
  error: undefined,
  value: {},
};

const AuthForm = ({ type, onSubmit }: AuthFormProps) => {
  const [state, formAction, isPending] = useActionState(
    async (state: LoginState | SignupState, formData: FormData) => {
      return onSubmit(state || initialState, formData);
    },
    initialState
  );

  const [passwordState, setPasswordState] = useState<PasswordState>({
    error: undefined,
    values: {
      password: "",
      passwordConfirm: "",
    },
  });
  const isLoginForm = type === "login";
  const title = isLoginForm ? "Sign in" : "Sign up";
  const switchText = isLoginForm ? "Need an account?" : "Have an account?";
  const switchLink = isLoginForm ? "/register" : "/login";

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPasswordState((prev) => {
      const newState = { ...prev, values: { ...prev.values, [name]: value } };

      // 비밀번호 확인이 있을 때만 검증
      if (
        (name === "password" && prev.values.passwordConfirm) ||
        (name === "passwordConfirm" && prev.values.password)
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

  return (
    <div className="container mx-auto px-4 pt-4 ">
      <div className="flex justify-center ">
        <section className="w-full max-w-md">
          <header className="mb-8">
            <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="text-center mt-2">
              <Link
                href={switchLink}
                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
              >
                {switchText}
              </Link>
            </p>
          </header>

          <form className="space-y-6" action={formAction}>
            <ErrorDisplay message={state.error?.message} />
            {!isLoginForm && (
              <fieldset className="mb-4">
                <ValidationInput
                  state={state}
                  props={{
                    type: "text",
                    name: "username",
                    placeholder: "Username",
                    required: true,
                    defaultValue: state?.value?.username || "",
                  }}
                />
              </fieldset>
            )}
            <fieldset className="mb-4">
              <ValidationInput
                state={state}
                props={{
                  type: "email",
                  name: "email",
                  placeholder: "Email",
                  autoComplete: "email",
                  required: true,
                  defaultValue: state?.value?.email || "",
                }}
              />
            </fieldset>
            <fieldset className="mb-4">
              <ValidationInput
                state={passwordState}
                props={{
                  type: "password",
                  name: "password",
                  placeholder: "Password",
                  autoComplete: "current-password",
                  required: true,
                  onChange: handlePasswordChange,
                  value: passwordState.values.password,
                }}
              />
              {!isLoginForm && (
                <PasswordStrength password={passwordState.values.password} />
              )}
            </fieldset>
            {!isLoginForm && (
              <fieldset className="mb-4">
                <ValidationInput
                  state={passwordState}
                  props={{
                    type: "password",
                    name: "passwordConfirm",
                    placeholder: "Password Confirm",
                    required: true,
                    onChange: handlePasswordChange,
                    value: passwordState.values.passwordConfirm,
                  }}
                />
              </fieldset>
            )}
            <button
              className="w-full py-2 px-4 text-lg 
                  text-white
                  bg-green-600 hover:bg-green-700 
                  dark:bg-green-500 dark:hover:bg-green-600
                  rounded-md 
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-green-500 dark:focus:ring-green-400
                  disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed
                  "
              type="submit"
              disabled={isPending || !!passwordState.error}
            >
              {title}
            </button>
          </form>

          <section className="mt-8">
            <div className="mt-6">
              <GoogleLoginBtn type={type} />
            </div>
          </section>
        </section>
      </div>
    </div>
  );
};

export default AuthForm;
