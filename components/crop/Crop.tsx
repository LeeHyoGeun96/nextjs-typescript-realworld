import { Area } from "react-easy-crop";

import React, { useState } from "react";

import Cropper from "react-easy-crop";
import "./styles.module.css";
import getCroppedImg from "@/utils/crop/getCroppedImg";

type CropProps = {
  imageSrc: string;
  setCroppedImage: (croppedImage: File | null) => void;
};

export default function Crop({ imageSrc, setCroppedImage }: CropProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = async (
    _croppedArea: Area,
    croppedAreaPixels: Area
  ) => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    setCroppedImage(croppedImage);
  };

  return (
    <div className="App">
      <div className="crop-container h-[400px] relative w-full bg-gray-200">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1 / 1}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          cropShape="round"
          objectFit="contain"
        />
      </div>
      <div className="controls">
        <input
          type="range"
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e) => {
            setZoom(Number(e.target.value));
          }}
          className="zoom-range accent-brand-primary h-2 bg-gray-200 rounded-lg cursor-pointer "
        />
      </div>
    </div>
  );
}
