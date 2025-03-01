"use client";

import { deleteAccount } from "@/actions/auth";
import { Input } from "@/components/Input";
import { Button } from "@/components/ui/Button/Button";
import Modal from "@/components/ui/Modal";

import { useUser } from "@/hooks/useUser";
import logout from "@/utils/auth/authUtils";
import {
  handleApiError,
  handleUnexpectedError,
} from "@/utils/error/errorHandle";

import { useEffect, useState } from "react";

const CHECK_TEXT = "탈퇴하겠습니다";

export default function DeleteUserModalPage() {
  const { user } = useUser();

  const [valid, setValid] = useState(false);
  const handleCheckText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValid(e.target.value === CHECK_TEXT);
  };
  const [unexpectedError, setUnexpectedError] = useState<string | null>(null);

  useEffect(() => {
    if (unexpectedError) {
      throw unexpectedError;
    }
  }, [unexpectedError]);

  const handleDeleteUser = async () => {
    if (!valid) return;
    try {
      const deleteAccountResponse = await deleteAccount(user.id);
      handleApiError(deleteAccountResponse, "회원 탈퇴 실패");

      logout();
    } catch (error) {
      handleUnexpectedError(error, "회원 탈퇴", setUnexpectedError);
    }
  };

  return (
    <>
      <Modal>
        <Modal.Header>회원 탈퇴</Modal.Header>
        <Modal.Content className="p-4">
          <p>회원 탈퇴 시 모든 데이터가 삭제됩니다.</p>
          <p className="mb-4">
            정말 탈퇴하시겠습니까? 원한다면{" "}
            <strong className="font-bold text-red-500">
              &quot;{CHECK_TEXT}&quot;
            </strong>{" "}
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
