"use client";

import { updateAvatar } from "@/actions/storage";
import Crop from "@/components/crop/Crop";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { Button } from "@/components/ui/Button/Button";
import Modal from "@/components/ui/Modal";
import { useAvatar } from "@/context/avatar/AvatarContext";
import { useUser } from "@/hooks/useUser";
import { ResponseUserType } from "@/types/authTypes";
import { useRouter } from "next/navigation";
import { useState } from "react";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function AvatarModalPage() {
  const router = useRouter();
  const { imageData, setCroppedImage, croppedImage } = useAvatar();
  const { user, mutate } = useUser();
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (croppedImage) {
      const base64Image = await fileToBase64(croppedImage);

      await mutate(
        async (currentData: ResponseUserType | undefined) => {
          const updateAvatarResponse = await updateAvatar(
            croppedImage,
            user?.id
          );

          if (!updateAvatarResponse.success) {
            const errorMessage =
              updateAvatarResponse.error?.message ||
              "프로필 이미지 업데이트에 실패했습니다.";
            setError(errorMessage);
            throw new Error(errorMessage);
          }

          const publicUrl = updateAvatarResponse.value?.publicUrl;

          if (!currentData?.user.username) {
            setError("사용자 정보가 없습니다.");
            throw new Error("사용자 정보가 없습니다.");
          }

          return {
            ...currentData,
            user: { ...currentData.user, image: publicUrl },
          };
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

      router.back();
    } else {
      setError("파일이 선택되지 않았습니다");
    }
  };

  return (
    <Modal>
      <Modal.Header>Update Profile Picture</Modal.Header>
      <Modal.Content className="w-full relative">
        <ErrorDisplay message={error} />
        {imageData && (
          <>
            <Crop imageSrc={imageData} setCroppedImage={setCroppedImage} />
          </>
        )}
      </Modal.Content>
      <Modal.Footer>
        <button onClick={() => router.back()} className=" text-gray-600">
          Cancel
        </button>
        <Button onClick={handleSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}
