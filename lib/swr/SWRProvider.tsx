"use client";

import { SWRConfig } from "swr";

type SWRProviderProps = {
  children: React.ReactNode;
  fallback: Record<string, unknown>;
};

export default function SWRProvider({ children, fallback }: SWRProviderProps) {
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
