"use client";

import { updateAvatar } from "@/actions/storage";
import Crop from "@/components/crop/Crop";
import { Button } from "@/components/ui/Button/Button";
import Modal from "@/components/ui/Modal";
import { API_ENDPOINTS } from "@/constant/api";
import { useAvatar } from "@/context/avatar/AvatarContext";
import { CurrentUserType } from "@/types/authTypes";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";

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

  const { data: previousData } = useSWR(API_ENDPOINTS.CURRENT_USER);

  const handleSave = async () => {
    try {
      if (croppedImage) {
        const base64Image = await fileToBase64(croppedImage);

        await mutate(
          API_ENDPOINTS.CURRENT_USER,
          async (
            currentData: Pick<CurrentUserType, "image" | "username"> | undefined
          ) => {
            try {
              const publicUrl = await updateAvatar(croppedImage);
              if (!currentData?.username) {
                throw new Error("Username is required");
              }
              return { ...currentData, image: publicUrl };
            } catch (error) {
              console.error("Error updating avatar:", error);
              return previousData;
            }
          },
          {
            optimisticData: (currentData) => ({
              ...currentData,
              image: base64Image,
            }),
            revalidate: true,
          }
        );
      }

      router.back();
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  return (
    <Modal>
      <Modal.Header>Update Profile Picture</Modal.Header>
      <Modal.Content className="w-full relative">
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
