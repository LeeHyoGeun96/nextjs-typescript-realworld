"use client";

import { updateAvatar } from "@/actions/storage";
import Crop from "@/components/crop/Crop";
import { Button } from "@/components/ui/Button/Button";
import Modal from "@/components/ui/Modal";
import { useAvatar } from "@/context/avatar/AvatarContext";
import { useUser } from "@/hooks/useUser";
import { ResponseUserType } from "@/types/authTypes";
import {
  handleApiError,
  handleUnexpectedError,
} from "@/utils/error/errorHandle";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

interface ChangeAvatarModalProps {
  onClose: () => void;
}

export default function ChangeAvatarModal({ onClose }: ChangeAvatarModalProps) {
  const router = useRouter();
  const { imageData, setCroppedImage, croppedImage } = useAvatar();
  const { user, mutate } = useUser();
  const [unexpectedError, setUnexpectedError] = useState<string | null>(null);

  if (unexpectedError) {
    throw new Error(unexpectedError);
  }

  const handleSave = async () => {
    if (croppedImage) {
      const base64Image = await fileToBase64(croppedImage);

      await mutate(
        async (currentData: ResponseUserType | undefined) => {
          if (!currentData) {
            throw new Error("사용자 데이터를 찾을 수 없습니다");
          }

          try {
            const updateAvatarResponse = await updateAvatar(
              croppedImage,
              user?.id
            );

            handleApiError(updateAvatarResponse, "프로필 이미지 업데이트 실패");

            const publicUrl = updateAvatarResponse.value?.publicUrl;

            return {
              ...currentData,
              user: { ...currentData.user, image: publicUrl },
            };
          } catch (error) {
            handleUnexpectedError(
              error,
              "프로필 이미지 업데이트",
              setUnexpectedError
            );
          }
        },
        {
          optimisticData: (currentData: ResponseUserType | undefined) => ({
            ...currentData,
            user: { ...currentData?.user, image: base64Image },
          }),

          rollbackOnError: true,
          revalidate: false,
        }
      );
    } else {
      toast.error("파일이 선택되지 않았습니다");
    }
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <Modal.Header onClose={onClose}>프로필 이미지 업데이트</Modal.Header>
      <Modal.Content className="w-full relative">
        {imageData && (
          <>
            <Crop imageSrc={imageData} setCroppedImage={setCroppedImage} />
          </>
        )}
      </Modal.Content>
      <Modal.Footer>
        <button onClick={() => router.back()} className=" text-gray-600">
          취소
        </button>
        <Button onClick={handleSave} disabled={!croppedImage}>
          저장
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
