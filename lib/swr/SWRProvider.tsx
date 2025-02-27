"use client";

import { SWRConfig } from "swr";

type SWRProviderProps<T> = {
  children: React.ReactNode;
  fallback: {
    [key: string]: T;
  };
};

export default function SWRProvider<T>({
  children,
  fallback,
}: SWRProviderProps<T>) {
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
