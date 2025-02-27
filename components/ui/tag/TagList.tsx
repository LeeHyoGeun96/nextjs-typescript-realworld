"use client";

import { useRouter } from "next/navigation";
import { memo, useCallback } from "react";
import { MdClose } from "react-icons/md";

interface TagListProps {
  tags: string[];
  selectedTag?: string;
  showDeleteButton?: boolean;
  className?: string;
  readOnly?: boolean;
}

const TagList = memo(
  ({
    tags,
    selectedTag,
    showDeleteButton = true,
    className = "",
    readOnly = false,
  }: TagListProps) => {
    const router = useRouter();

    const handleTagClick = useCallback(
      (e: React.MouseEvent, tag: string) => {
        // 이벤트 버블링 방지
        if (readOnly) return;
        e.preventDefault();
        e.stopPropagation();

        const current = new URLSearchParams();
        current.set("tag", tag);
        router.push(`/?${current.toString()}`);
      },
      [router, readOnly]
    );

    const handleDeleteTag = useCallback(
      (e: React.MouseEvent) => {
        // 이벤트 버블링 방지
        if (readOnly) return;
        e.preventDefault();
        e.stopPropagation();

        if (!selectedTag) return;
        const current = new URLSearchParams();
        current.delete("tag");
        router.push(`?${current.toString()}`);
      },
      [router, selectedTag, readOnly]
    );

    if (tags.length === 0) {
      return null;
    }

    return (
      <ul className={`flex flex-wrap gap-2 ${className}`}>
        {tags.map((tag) => (
          <li key={tag}>
            <button
              type="button"
              disabled={readOnly}
              className={`
              inline-block px-2 py-1 text-sm
              rounded-full transition-colors
              whitespace-nowrap
              ${
                readOnly
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
          </li>
        ))}
        {showDeleteButton && (
          <li>
            <button
              type="button"
              className="inline-block px-2 py-1 text-sm
            rounded-full border-red-500 bg-red-500 text-white hover:bg-red-400 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900/20 focus:ring-red-500 dark:focus:ring-red-400"
              onClick={handleDeleteTag}
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
