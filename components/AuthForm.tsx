"use client";

import Link from "next/link";

import { useActionState, useEffect } from "react";
import { ApiResponse, LoginState, SignupState } from "@/types/authTypes";
import { ValidationInput } from "./InputWithError";
import { ErrorDisplay } from "./ErrorDisplay";
import GoogleLoginBtn from "./GoogleLoginBtn";
import { login, signup } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { PasswordFields } from "./PasswordFields";
import { Button } from "./ui/Button/Button";

interface AuthFormProps {
  type: "login" | "register";
}

const initialState: LoginState | SignupState = {
  error: undefined,
  value: {},
  success: undefined,
};

const AuthForm = ({ type }: AuthFormProps) => {
  const router = useRouter();
  const actionHandler = async (
    prevState: LoginState | SignupState,
    formData: FormData
  ): Promise<ApiResponse> => {
    if (type === "login") {
      return await login(prevState as LoginState, formData);
    } else {
      return await signup(prevState as SignupState, formData);
    }
  };
  const [state, formAction, isPending] = useActionState(
    actionHandler,
    initialState
  );

  useEffect(() => {
    if (state?.success) {
      const redirect = async () => {
        if (type === "login") {
          await mutate("/api/currentUser");
          router.push("/");
        } else {
          router.push("/login");
        }
      };
      redirect();
    }
  }, [state?.success, type, router]);

  const isLoginForm = type === "login";
  const title = isLoginForm ? "Sign in" : "Sign up";
  const switchText = isLoginForm ? "Need an account?" : "Have an account?";
  const switchLink = isLoginForm ? "/register" : "/login";

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
            {type === "register" ? (
              <PasswordFields state={state} />
            ) : (
              <ValidationInput state={state} />
            )}
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              type="submit"
              disabled={isPending}
            >
              {title}
            </Button>
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
