"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";

interface CroppedImageProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function CroppedImage({
  className = "",
  width = 400,
  height = 400,
}: CroppedImageProps) {
  const searchParams = useSearchParams();

  const params = new URLSearchParams({
    x: searchParams.get("x") ?? "0",
    y: searchParams.get("y") ?? "0",
    width: searchParams.get("width") ?? "100",
    height: searchParams.get("height") ?? "100",
    rotation: searchParams.get("rotation") ?? "0",
    croppedImageSize: searchParams.get("croppedImageSize") ?? "small",
  });

  return (
    <Image
      src={`/api/crop?${params.toString()}`}
      alt="Cropped image"
      width={width}
      height={height}
      className={className}
    />
  );
}
