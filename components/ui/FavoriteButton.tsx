"use client";

import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";

interface FavoriteButtonProps {
  slug: string;
  favorited: boolean;
  favoritesCount: number;
  handleFavorite: (slug: string, favorited: boolean) => void;
}

export default function FavoriteButton({
  slug,
  favorited,
  favoritesCount,
  handleFavorite,
}: FavoriteButtonProps) {
  return (
    <button
      className={`ml-4 px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors
        ${
          favorited
            ? "bg-brand-primary text-white hover:bg-brand-secondary"
            : "border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
        }`}
      type="button"
      onClick={() => handleFavorite(slug, favorited)}
    >
      {favorited ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
      <span>{favoritesCount}</span>
    </button>
  );
}
