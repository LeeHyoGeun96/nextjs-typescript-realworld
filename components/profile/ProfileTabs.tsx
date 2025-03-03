// components/profile/ProfileTabs.tsx
"use client";

import Link from "next/link";
import ArticleList from "../ArticleList";

interface ProfileTabsProps {
  username: string;
  apiKeys: Record<string, string>;
  initialData: Record<string, unknown>;
  isFavoritesTab: boolean;
}

export default function ProfileTabs({
  username,
  apiKeys,
  initialData,
  isFavoritesTab,
}: ProfileTabsProps) {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-3xl mx-auto">
        {/* 탭 네비게이션 */}
        <nav className="flex border-b border-gray-200 mb-6">
          <Link
            href={`/profile/${username}`}
            className={`px-4 py-2 font-medium ${
              !isFavoritesTab
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={(e) => {
              if (!isFavoritesTab) {
                e.preventDefault();
              }
            }}
          >
            My Articles
          </Link>
          <Link
            href={`/profile/${username}/favorites`}
            className={`px-4 py-2 font-medium ${
              isFavoritesTab
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={(e) => {
              if (isFavoritesTab) {
                e.preventDefault();
              }
            }}
          >
            Favorited Articles
          </Link>
        </nav>

        {/* 탭 컨텐츠 */}
        <div className="tab-content">
          <ArticleList
            apiKeys={apiKeys}
            initialData={initialData}
            tab={"global"}
          />
        </div>
      </div>
    </div>
  );
}
