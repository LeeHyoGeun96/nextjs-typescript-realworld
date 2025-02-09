"use client";

import { Input } from "./Input";
import { InputHTMLAttributes } from "react";
import { ErrorDisplay } from "./ErrorDisplay";

interface InputWithErrorProps {
  errorMessage?: string;
  props: InputHTMLAttributes<HTMLInputElement>;
  className?: string;
}

export const InputWithError = ({
  props,
  className,
  errorMessage,
}: InputWithErrorProps) => {
  return (
    <section className={className}>
      <Input
        {...props}
        className={`${props.className || ""} ${
          errorMessage
            ? " border-red-500 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500"
            : ""
        }`}
      />
      <ErrorDisplay message={errorMessage} />
    </section>
  );
};
