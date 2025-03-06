"use client";

import { useRouter } from "@bprogress/next/app";
import { memo, useCallback } from "react";
import { MdClose } from "react-icons/md";

interface TagListProps {
  mode: "edit" | "filter";
  tags: string[];
  selectedTag?: string;
  showUnfilterButton?: boolean;
  className?: string;
  onDeleteTag?: (tag: string) => void;
}

const TagList = memo(
  ({
    mode = "filter",
    tags,
    selectedTag,
    showUnfilterButton = true,
    className = "",
    onDeleteTag,
  }: TagListProps) => {
    const router = useRouter();

    const isEditMode = mode === "edit";

    const handleTagClick = useCallback(
      (e: React.MouseEvent, tag: string) => {
        if (tag === selectedTag) {
          return;
        }
        // 이벤트 버블링 방지
        if (isEditMode) return;
        e.preventDefault();
        e.stopPropagation();

        const current = new URLSearchParams();
        current.set("tag", tag);
        router.push(`/?${current.toString()}`, { showProgress: true });
      },
      [router, isEditMode, selectedTag]
    );

    const handleUnfilterTag = useCallback(
      (e: React.MouseEvent) => {
        // 이벤트 버블링 방지
        if (isEditMode) return;
        e.preventDefault();
        e.stopPropagation();

        if (!selectedTag) return;
        const current = new URLSearchParams();
        current.delete("tag");
        router.push(`?${current.toString()}`);
      },
      [router, selectedTag, isEditMode]
    );

    const handleDeleteTag = useCallback(
      (tag: string) => {
        onDeleteTag?.(tag);
      },
      [onDeleteTag]
    );

    if (tags.length === 0) {
      return null;
    }

    return (
      <ul className={`flex flex-wrap gap-2 ${className}`}>
        {tags.map((tag) => (
          <li key={tag} className="flex items-center gap-1">
            <button
              type="button"
              disabled={isEditMode}
              className={`
              inline-block px-2 py-1 text-sm
              rounded-full transition-colors
              whitespace-nowrap
              ${
                isEditMode
                  ? "cursor-default text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700"
                  : selectedTag === tag
                  ? "bg-green-500 text-white"
                  : "text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              }
            `}
              onClick={(e) => handleTagClick(e, tag)}
            >
              {tag}
            </button>
            {isEditMode && (
              <button type="button" onClick={() => handleDeleteTag(tag)}>
                <MdClose className="w-3 h-3 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            )}
          </li>
        ))}
        {showUnfilterButton && (
          <li>
            <button
              type="button"
              className="inline-block px-2 py-1 text-sm
            rounded-full border-red-500 bg-red-400 dark:bg-red-600 text-white hover:bg-red-300 dark:border-red-400 dark:text-gray-300 dark:hover:bg-red-500 focus:ring-red-500 dark:focus:ring-red-400"
              onClick={handleUnfilterTag}
            >
              <MdClose className="w-4 h-4" />
            </button>
          </li>
        )}
      </ul>
    );
  }
);

// 디버깅을 위한 컴포넌트 이름 설정
TagList.displayName = "TagList";

export default TagList;
