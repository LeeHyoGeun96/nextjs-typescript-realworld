import { AuthState } from "@/types/authTypes";
import { Input } from "./Input";
import { InputHTMLAttributes } from "react";
import { ErrorDisplay } from "./ErrorDisplay";

interface ValidationInputProps {
  errors: AuthState | void;
  props: InputHTMLAttributes<HTMLInputElement>;
}

export const ValidationInput = ({ errors, props }: ValidationInputProps) => {
  if (!errors) {
    return null;
  }

  const fieldName = props.name || "";
  const hasError = Boolean(errors?.errors[fieldName]);

  return (
    <section>
      <Input
        {...props}
        className={`${props.className || ""} ${
          hasError
            ? "border-red-500 ring-2 ring-red-500 focus:border-red-500 focus:ring-red-500"
            : ""
        }`}
      />
      <ErrorDisplay authState={errors} field={fieldName} />
    </section>
  );
};
