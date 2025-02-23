"use client";

import { deleteAccount } from "@/actions/auth";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { Input } from "@/components/Input";
import { Button } from "@/components/ui/Button/Button";
import Modal from "@/components/ui/Modal";
import { useUser } from "@/hooks/useUser";
import { isDisplayError } from "@/types/error";
import logout from "@/utils/auth/authUtils";
import { useEffect, useState } from "react";

const CHECK_TEXT = "탈퇴하겠습니다";

export default function DeleteUserModalPage() {
  const [valid, setValid] = useState(false);
  const handleCheckText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValid(e.target.value === CHECK_TEXT);
  };
  const [error, setError] = useState<Error | null>(null);
  const [unexpectedError, setUnexpectedError] = useState<Error | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (unexpectedError) {
      throw unexpectedError;
    }
  }, [unexpectedError]);

  const handleDeleteUser = async () => {
    if (!valid) return;

    const data = await deleteAccount(user.token, user.id);
    if (!data.success) {
      if (isDisplayError(data.error)) {
        setError(data.error);
      } else {
        setUnexpectedError(data.error!);
      }
    } else {
      logout();
    }
  };

  return (
    <>
      <Modal>
        <Modal.Header>회원 탈퇴</Modal.Header>
        <Modal.Content className="p-4">
          <ErrorDisplay message={error?.message} />
          <p>회원 탈퇴 시 모든 데이터가 삭제됩니다.</p>
          <p className="mb-4">
            정말 탈퇴하시겠습니까? 원한다면{" "}
            <span className="font-bold text-red-500">
              &quot;{CHECK_TEXT}&quot;
            </span>{" "}
            를 입력하고 버튼을 눌러주세요.
          </p>
          <Input
            type="text"
            placeholder={CHECK_TEXT}
            onChange={handleCheckText}
          />
        </Modal.Content>
        <Modal.Footer>
          <Button disabled={!valid} onClick={handleDeleteUser}>
            회원 탈퇴
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
