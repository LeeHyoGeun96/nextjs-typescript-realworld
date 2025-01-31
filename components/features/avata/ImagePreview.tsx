import Image from "next/image";

interface ImagePreviewProps {
  src: string;
}

export function ImagePreview({ src }: ImagePreviewProps) {
  return (
    <div className="relative w-32 h-32 mx-auto">
      <Image
        src={src}
        alt="Preview"
        className="w-full h-full object-cover rounded-full"
        width={128}
        height={128}
      />
    </div>
  );
}
