import { useState, useEffect } from "react";
import { PasswordState } from "@/types/authTypes";
import { PasswordError } from "@/types/error";

interface UsePasswordProps {
  isLoginForm?: boolean;
  // 부모에서 초기 상태를 지정할 수 있도록 선택적으로 받음
  initialValues?: {
    password: string;
    passwordConfirm: string;
  };
  // 상태가 변경될 때 부모에 알리기 위한 콜백
  onStateChange?: (state: PasswordState) => void;
}

export function UsePasswordProps({
  isLoginForm = false,
  initialValues = { password: "", passwordConfirm: "" },
  onStateChange,
}: UsePasswordProps) {
  const [passwordState, setPasswordState] = useState<PasswordState>({
    error: undefined,
    value: initialValues,
  });

  // 상태 변경 시 부모로 전달하는 효과
  useEffect(() => {
    if (onStateChange) {
      onStateChange(passwordState);
    }
  }, [passwordState, onStateChange]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPasswordState((prev) => {
      const newValues = { ...prev.value, [name]: value };
      let newError = prev.error;

      if (!isLoginForm && newValues.password && newValues.passwordConfirm) {
        newError =
          newValues.password !== newValues.passwordConfirm
            ? ({
                name: "PasswordError",
                message: "비밀번호가 일치하지 않습니다",
              } as PasswordError)
            : undefined;
      }

      return {
        ...prev,
        value: newValues,
        error: newError,
      };
    });
  };

  // 외부에서 상태를 직접 변경할 수 있도록 setPasswordState도 반환
  return {
    passwordState,
    handlePasswordChange,
    setPasswordState,
  };
}
