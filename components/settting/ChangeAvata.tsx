"use client";

import { useAvatar } from "@/context/avatar/AvatarContext";
import readFileAsDataURL from "@/util/readFileAsDataURL";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Button } from "../ui/Button/Button";
import { API_ENDPOINTS } from "@/constant/api";
import { TimestampAvatar } from "../ui/Avata/TimestampAvatar";
import { deleteAvatar } from "@/actions/storage";
import useSWR from "swr";

export default function ChangeAvata() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setImageData } = useAvatar();
  const { data: user, mutate: boundMutate } = useSWR(
    API_ENDPOINTS.CURRENT_USER
  );
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64 = await readFileAsDataURL(file);
      setImageData(base64);
      router.push("/settings/avatar");
    }
    event.target.value = "";
  };

  const handleDeleteAvatar = async () => {
    await boundMutate(
      async () => {
        const { success } = await deleteAvatar();
        if (!success) {
          throw new Error("Failed to delete avatar");
        }
        return { ...user, image: null };
      },
      {
        optimisticData: { ...user, image: null },
        rollbackOnError: true,
        revalidate: false,
      }
    );
  };

  return (
    <section>
      <div className="mb-8">
        <div className="flex items-center gap-8 flex-col">
          <TimestampAvatar size="xxxxl" user={user} />
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
    </section>
  );
}
