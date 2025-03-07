"use client";

import { useAvatar } from "@/context/avatar/AvatarContext";
import readFileAsDataURL from "@/utils/readFileAsDataURL";
import { useRef, useState } from "react";
import { Button } from "../ui/Button/Button";
import Avatar from "../ui/Avata/Avatar";
import { deleteAvatar } from "@/actions/storage";
import { useUser } from "@/hooks/useUser";

import {
  handleApiError,
  handleUnexpectedError,
} from "@/utils/error/errorHandle";
import ChangeAvatarModal from "../ui/Modal/ChangeAvatarModal";
export default function ChangeAvata() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setImageData } = useAvatar();
  const { user, mutate: boundMutate, userResponse } = useUser();
  const [unexpectedError, setUnexpectedError] = useState<string | null>(null);
  const [showChangeAvatarModal, setShowChangeAvatarModal] = useState(false);

  if (unexpectedError) {
    throw new Error(unexpectedError);
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const base64 = await readFileAsDataURL(file);
        setImageData(base64);
        setShowChangeAvatarModal(true);
      } else {
        alert("이미지 파일만 선택할 수 있습니다.");
      }
    }
    event.target.value = "";
  };

  const handleDeleteAvatar = async () => {
    await boundMutate(
      async () => {
        try {
          const deleteAvatarResponse = await deleteAvatar(user.id);
          handleApiError(deleteAvatarResponse, "프로필 이미지 삭제 실패");

          return {
            ...userResponse,
            user: { ...userResponse?.user, image: null },
          };
        } catch (error) {
          handleUnexpectedError(
            error,
            "프로필 이미지 삭제",
            setUnexpectedError
          );
        }
      },
      {
        optimisticData: () => ({
          ...userResponse,
          user: { ...userResponse?.user, image: null },
        }),
        rollbackOnError: true,
        revalidate: false,
        populateCache: true,
      }
    );
  };

  return (
    <section>
      <div className="mb-8">
        <div className="flex items-center gap-8 flex-col">
          <Avatar size="xxxxl" user={user} />
          <input
            type="file"
            accept="image/*"
            className="w-full"
            onChange={handleFileChange}
            ref={fileInputRef}
            hidden
          />
          <div className="flex gap-4">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="primary"
              size="lg"
            >
              사진 변경
            </Button>
            <Button variant="primary" size="lg" onClick={handleDeleteAvatar}>
              기본 이미지로
            </Button>
          </div>
        </div>
      </div>
      {showChangeAvatarModal && (
        <ChangeAvatarModal onClose={() => setShowChangeAvatarModal(false)} />
      )}
    </section>
  );
}
