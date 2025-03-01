"use client";

import { CurrentUserType } from "@/types/authTypes";
import Image from "next/image";
import { useState } from "react";

export const AVATAR_SIZE = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xxxxl: "w-32 h-32",
} as const;

export type AvatarSize = keyof typeof AVATAR_SIZE;

interface AvatarProps {
  user: Pick<CurrentUserType, "image" | "username"> | null | undefined;
  size?: AvatarSize;
  className?: string;
}

const Avatar = ({ user, size = "md", className = "" }: AvatarProps) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    xxl: "w-20 h-20",
    xxxl: "w-24 h-24",
    xxxxl: "w-32 h-32",
  };

  const handleError = () => {
    setImgError(true);
  };
  const { username, image } = user || {};
  const defaultImage = `https://ui-avatars.com/api/?name=${username}&format=png`;

  const imageUrl = imgError || !image ? defaultImage : image;

  return (
    <Image
      src={imageUrl}
      alt={`${username}'s avatar`}
      width={24}
      height={24}
      className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
      onError={handleError}
      quality={75}
    />
  );
};

export default Avatar;
