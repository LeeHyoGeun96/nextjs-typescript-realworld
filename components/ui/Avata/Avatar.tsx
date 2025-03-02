"use client";

import { CurrentUserType } from "@/types/authTypes";
import Image from "next/image";
import { useEffect, useState } from "react";

export const AVATAR_SIZE = {
  sm: { class: "w-6 h-6", size: 24 },
  md: { class: "w-8 h-8", size: 32 },
  lg: { class: "w-12 h-12", size: 48 },
  xl: { class: "w-16 h-16", size: 64 },
  xxl: { class: "w-20 h-20", size: 80 },
  xxxl: { class: "w-24 h-24", size: 96 },
  xxxxl: { class: "w-32 h-32", size: 128 },
} as const;

export type AvatarSize = keyof typeof AVATAR_SIZE;

interface AvatarProps {
  user: Pick<CurrentUserType, "image" | "username"> | null | undefined;
  size?: AvatarSize;
  className?: string;
}

const Avatar = ({ user, size = "md", className = "" }: AvatarProps) => {
  const [imgError, setImgError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 사이드에서만 실행되는 코드
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleError = () => {
    setImgError(true);
  };
  const { username, image } = user || {};
  const defaultImage = `https://ui-avatars.com/api/?name=${username}&format=png`;

  const imageUrl = (isClient && imgError) || !image ? defaultImage : image;

  return (
    <Image
      src={imageUrl}
      alt={`${username}'s avatar`}
      width={24}
      height={24}
      className={`rounded-full object-cover ${AVATAR_SIZE[size].class} ${className}`}
      sizes={`${AVATAR_SIZE[size].size}px`}
      onError={handleError}
      quality={100}
    />
  );
};

export default Avatar;
