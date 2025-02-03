import { Input } from "./Input";
import { InputHTMLAttributes } from "react";
import { ErrorDisplay } from "./ErrorDisplay";
import { LoginState, PasswordState, SignupState } from "@/types/authTypes";
import { SupabaseAuthError, ValidationError } from "@/error/errors";

interface ValidationInputProps {
  state: SignupState | LoginState | PasswordState;
  props: InputHTMLAttributes<HTMLInputElement>;
}

export const ValidationInput = ({ state, props }: ValidationInputProps) => {
  const fieldName = props.name || "";
  let errorMessage = "";

  if (state.error instanceof ValidationError) {
    errorMessage = state.error.fieldErrors[fieldName];
  } else if (state.error instanceof SupabaseAuthError) {
    errorMessage = state.error.message;
  }

  return (
    <section>
      <Input
        {...props}
        className={`${props.className || ""} ${
          errorMessage
            ? "border-red-500 ring-2 ring-red-500 focus:border-red-500 focus:ring-red-500"
            : ""
        }`}
      />
      <ErrorDisplay message={errorMessage} />
    </section>
  );
};
