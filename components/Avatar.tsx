"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface AvatarProps {
  username: string;
  image?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  timestamp: string;
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
