import { SearchParams } from "@/types/global";
import { initializeParams } from "./params";

interface ParseQueryParamsProps {
  searchParams: SearchParams;
  addParams?: Record<string, string | undefined>;
  limit?: number;
}

export const parseQueryParams = async ({
  searchParams,
  addParams,
  limit,
}: ParseQueryParamsProps) => {
  const params = await initializeParams(searchParams, {
    limit: limit?.toString(),
  });

  const page = Number(params.page) || 1;
  const limitValue = Number(params.limit) || limit || 10;
  const offset = (page - 1) * limitValue;
  const tab = params.tab || "global";
  const tag = params.tag || "";
  const author = params.author || "";
  const favorited = params.favorited || "";

  const queryString = new URLSearchParams({
    offset: offset.toString(),
    limit: limitValue.toString(),
    ...(author && { author }),
    ...(favorited && { favorited }),
    ...(params.tag && { tag: params.tag }),
  });

  if (addParams) {
    Object.entries(addParams).forEach(([key, value]) => {
      if (value) {
        queryString.set(key, value);
      }
    });
  }

  const apiQueryString = queryString.toString();

  return {
    apiQueryString,
    tab,
    tag,
  };
};
