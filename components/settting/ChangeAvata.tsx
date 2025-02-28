"use client";

import { useAvatar } from "@/context/avatar/AvatarContext";
import readFileAsDataURL from "@/utils/readFileAsDataURL";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "../ui/Button/Button";
import { TimestampAvatar } from "../ui/Avata/TimestampAvatar";
import { deleteAvatar } from "@/actions/storage";
import { useUser } from "@/hooks/useUser";
import { ResponseUserType } from "@/types/authTypes";
import { ErrorDisplay } from "../ErrorDisplay";
export default function ChangeAvata() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setImageData } = useAvatar();
  const { user, mutate: boundMutate } = useUser();
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const base64 = await readFileAsDataURL(file);
        setImageData(base64);
        router.push("/settings/avatar");
      } else {
        alert("이미지 파일만 선택할 수 있습니다.");
      }
    }
    event.target.value = "";
  };

  const handleDeleteAvatar = async () => {
    await boundMutate(
      async (prevData: ResponseUserType | undefined) => {
        const { success, error } = await deleteAvatar(user.id);
        if (!success) {
          const errorMessage =
            error?.message || "프로필 이미지 삭제에 실패했습니다.";
          setError(errorMessage);
          throw new Error(errorMessage);
        }
        return {
          ...prevData,
          user: { ...prevData?.user, image: null },
        };
      },
      {
        optimisticData: (prevData: ResponseUserType | undefined) => ({
          ...prevData,
          user: { ...prevData?.user, image: null },
        }),
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
          <ErrorDisplay message={error} />
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
