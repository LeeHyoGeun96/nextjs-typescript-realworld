import { SearchParams } from "@/types/global";
import { initializeParams } from "./params";

export const parseQueryParams = async (searchParams: SearchParams) => {
  const params = await initializeParams(searchParams);

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const offset = (page - 1) * limit;
  const tab = params.tab || "global";
  const tag = params.tag || "";

  const apiQueryString = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
    ...(params.tag && { tag: params.tag }),
  }).toString();

  return {
    apiQueryString,
    tab,
    tag,
  };
};
