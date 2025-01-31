"use client";

import { createContext, useState, ReactNode, useContext } from "react";

interface AvatarContextType {
  imageData: string | null;
  setImageData: (imageData: string | null) => void;
  croppedImage: File | null;
  setCroppedImage: (croppedImage: File | null) => void;
}

export const AvatarContext = createContext<AvatarContextType | null>(null);

export function AvatarProvider({ children }: { children: ReactNode }) {
  const [imageData, setImageData] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<File | null>(null);
  return (
    <AvatarContext.Provider
      value={{ imageData, setImageData, croppedImage, setCroppedImage }}
    >
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatar() {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error("useAvatar must be used within AvatarProvider");
  }
  return context;
}
