"use client";

import { ArticleType } from "@/types/articleTypes";
import { SWRConfig } from "swr";

type ArticlesFallback = {
  [key: string]: {
    globalArticles?: ArticleType[];
    globalArticlesCount?: number;
    feedArticles?: ArticleType[];
    feedArticlesCount?: number;
  };
};

export default function SWRProvider({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback: ArticlesFallback;
}) {
  return (
    <SWRConfig
      value={{
        fetcher: async (url) => {
          const response = await fetch(url, {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          });
          return response.json();
        },
        fallback,
        revalidateOnFocus: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
