export interface ArticleParams {
  tab?: string;
  tag?: string;
  page?: string;
  limit?: string;
}

export const DEFAULT_PARAMS: ArticleParams = {
  tab: "global",
  tag: "",
  page: "1",
  limit: "10",
};

export type TabType = "global" | "personal";

// 비동기 파라미터 초기화 함수
export async function initializeParams(
  searchParams: Promise<Record<string, string | string[] | undefined>>
): Promise<ArticleParams> {
  const params = await searchParams;
  const convertedParams: ArticleParams = {};

  Object.entries(params).forEach(([key, value]) => {
    if (key in DEFAULT_PARAMS) {
      convertedParams[key as keyof ArticleParams] = Array.isArray(value)
        ? value[0]
        : (value as string);
    }
  });

  return { ...DEFAULT_PARAMS, ...convertedParams };
}
