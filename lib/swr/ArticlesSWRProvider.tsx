"use client";

import { ArticleType, CommentType } from "@/types/articleTypes";
import { SWRConfig } from "swr";

type ArticlesFallback = {
  [key: string]: {
    article: ArticleType;
    comments: CommentType[];
  };
};

export default function ArticlesSWRProvider({
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
