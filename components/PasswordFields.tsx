import { ValidationInput } from "./ValidationInput";
import { PasswordStrength } from "./PasswordStrength";
import { usePasswordValidation } from "@/hooks/usePasswordValidation";

interface PasswordFieldsProps {
  isLoginForm: boolean;
}

export function PasswordFields({ isLoginForm = false }: PasswordFieldsProps) {
  const { passwordState, handlePasswordChange } = usePasswordValidation({
    isLoginForm,
  });

  return (
    <>
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
    </>
  );
}
