import FeedToggle from "@/components/Home/FeedToggle";
import ArticleList from "@/components/ArticleList";
import { Pagination } from "@/components/ui/Pagination";
import SelectTag from "@/components/ui/tag/SelectTag";

import { SearchParams } from "@/types/global";
import { optionalAuthHeaders } from "@/utils/auth/optionalAuthHeaders";
import { parseQueryParams } from "@/utils/parseQueryParams";
import { cookies } from "next/headers";
import SWRProvider from "@/lib/swr/SWRProvider";

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const headers = optionalAuthHeaders(token);

  const { apiQueryString, tab, tag } = await parseQueryParams({ searchParams });

  const articlesKey = `/api/articles?${apiQueryString}`;
  const feedKey = `/api/articles/feed?${apiQueryString}`;

  const apiKeys = {
    articlesKey,
    feedKey,
  } as const;

  // API 요청을 병렬로 실행
  const [globalData, feedData, { tags }] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiKeys.articlesKey}`, {
      headers,
      cache: "no-store",
    }).then((res) => res.json()),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiKeys.feedKey}`, {
      headers,
      cache: "no-store",
    }).then((res) => res.json()),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tags`, {
      headers,
      cache: "no-store",
    }).then((res) => res.json()),
  ]);

  const articlesCount =
    tab === "personal" ? feedData.articlesCount : globalData.articlesCount;

  const fallback = {
    [apiKeys.articlesKey]: globalData,
    [apiKeys.feedKey]: feedData,
  };

  return (
    <SWRProvider fallback={fallback}>
      <div>
        {/* 헤더 섹션 - 컴포넌트로 분리 가능 */}

        <header className="bg-brand-primary dark:bg-gray-800 shadow-inner ">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="font-logo text-5xl md:text-6xl lg:text-7xl text-white mb-4 font-bold">
              conduit
            </h1>
            <p className="text-white text-xl md:text-2xl font-light">
              A place to share your knowledge.
            </p>
          </div>
        </header>
        {/* 메인 콘텐츠 */}
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 모바일 태그 선택 */}
            <div className="lg:hidden overflow-x-auto -mx-4 px-4">
              <SelectTag tags={tags} />
            </div>

            {/* 사이드바 왼쪽 공간 */}
            <div className="hidden lg:block lg:w-64"></div>

            {/* 메인 콘텐츠 영역 */}
            <div className="flex-1 max-w-3xl mx-auto w-full justify-center">
              <FeedToggle params={{ tab, tag }} isLoggedIn={!!token} />
              <ArticleList apiKeys={apiKeys} tab={tab} />
              <div className="mt-8">
                <Pagination total={articlesCount} limit={10} />
              </div>
            </div>

            {/* 사이드바 오른쪽 */}
            <aside className="hidden lg:block lg:w-64 ">
              <div className="lg:sticky lg:top-24">
                <SelectTag tags={tags} selectedTag={tag} />
              </div>
            </aside>
          </div>
        </main>
      </div>
    </SWRProvider>
  );
}
