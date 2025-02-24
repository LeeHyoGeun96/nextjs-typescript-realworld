"use client";

import { updateAvatar } from "@/actions/storage";
import Crop from "@/components/crop/Crop";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { Button } from "@/components/ui/Button/Button";
import Modal from "@/components/ui/Modal";
import { useAvatar } from "@/context/avatar/AvatarContext";
import { useUser } from "@/hooks/useUser";
import { ResponseUserType } from "@/types/authTypes";
import { isDisplayError } from "@/types/error";
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
  const [displayError, setDisplayError] = useState<string | null>(null);
  const [unexpectedError, setUnexpectedError] = useState<Error | null>(null);

  const handleSave = async () => {
    try {
      if (croppedImage) {
        const base64Image = await fileToBase64(croppedImage);

        await mutate(
          async (currentData: ResponseUserType | undefined) => {
            try {
              const publicUrl = await updateAvatar(croppedImage, user?.id);

              if (!currentData?.user.username) {
                throw setDisplayError("사용자 정보가 없습니다.");
              }

              return {
                ...currentData,
                user: { ...currentData.user, image: publicUrl },
              };
            } catch (error) {
              if (isDisplayError(error)) {
                setDisplayError(error.message);
              } else {
                setUnexpectedError(error as Error);
              }
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

        router.back();
      } else {
        throw setDisplayError("이미지가 선택되지 않았습니다");
      }
    } catch (error) {
      if (isDisplayError(error)) {
        setDisplayError(error.message);
      } else {
        setUnexpectedError(error as Error);
      }
    }
  };

  if (unexpectedError) {
    throw unexpectedError;
  }

  return (
    <Modal>
      <Modal.Header>Update Profile Picture</Modal.Header>
      <Modal.Content className="w-full relative">
        <ErrorDisplay message={displayError} />
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
