"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export const TIMESTAMP_AVATAR_SIZE = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xxxxl: "w-32 h-32",
} as const;

export type TimestampAvatarSize = keyof typeof TIMESTAMP_AVATAR_SIZE;

interface AvatarProps {
  username: string;
  image?: string | null;
  size?: TimestampAvatarSize;
  className?: string;
  timestamp?: string;
}

const Avatar = ({
  username,
  image,
  size = "md",
  className = "",
  timestamp,
}: AvatarProps) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [image, timestamp]);

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
  const defaultImage = `https://ui-avatars.com/api/?name=${username}&format=png`;

  const imageUrl =
    imgError || !image
      ? defaultImage
      : image.startsWith("data:image")
      ? image
      : `${image}?timestamp=${timestamp}`;

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
