"use client";

import { useAvatar } from "@/context/avatar/AvatarContext";
import readFileAsDataURL from "@/util/readFileAsDataURL";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Button } from "../ui/Button/Button";

export default function ChangeAvata() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setImageData } = useAvatar();

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

  return (
    <section>
      <div className="p-4">
        <div className="flex items-center gap-4">
          {/* <Avatar /> */}
          <input
            type="file"
            accept="image/*"
            className="w-full"
            onChange={handleFileChange}
            ref={fileInputRef}
            hidden
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="primary"
            size="lg"
          >
            Change Avatar
          </Button>
        </div>
      </div>
    </section>
  );
}
