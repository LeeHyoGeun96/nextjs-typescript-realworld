import FeedToggle from "@/components/FeedToggle";
import ArticleList from "@/components/Home/ArticleList";
import { Pagination } from "@/components/Home/Pagination";
import SelectTag from "@/components/SelectTag";
import { cookies } from "next/headers";

interface ArticleParams {
  page?: string;
  limit?: string;
  tag?: string;
  author?: string;
  favorited?: string;
  tab?: string;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<ArticleParams>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const offset = (page - 1) * limit;

  const queryParams = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
    ...(params.tag && { tag: params.tag }),
    ...(params.author && { author: params.author }),
  });

  const articlesResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/articles?${queryParams}`,
    {
      headers,
      cache: "no-store",
    }
  );

  const feedResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/articles/feed?${queryParams}`,
    {
      headers,
      cache: "no-store",
    }
  );

  const tagsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`, {
    headers,
    cache: "no-store",
  });

  const { articles: globalArticles, articlesCount: globalArticlesCount } =
    await articlesResponse.json();

  const { tags } = await tagsResponse.json();

  const { articles: feedArticles, articlesCount: feedArticlesCount } =
    await feedResponse.json();

  const articles = params.tab === "personal" ? feedArticles : globalArticles;
  const articlesCount =
    params.tab === "personal" ? feedArticlesCount : globalArticlesCount;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="bg-brand-primary dark:bg-gray-800 shadow-inner">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="font-logo text-5xl md:text-6xl lg:text-7xl text-white mb-4 font-bold">
            conduit
          </h1>
          <p className="text-white text-xl md:text-2xl font-light">
            A place to share your knowledge.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block lg:w-64"></div>
          <div className="lg:hidden overflow-x-auto -mx-4 px-4">
            <div className="flex space-x-2 whitespace-nowrap">
              <SelectTag tags={tags} />
            </div>
          </div>
          <div className="flex-1 max-w-3xl mx-auto w-full justify-center">
            <FeedToggle
              params={{ tab: params.tab, tag: params.tag }}
              isLoggedIn={!!token}
            />
            <ArticleList articles={articles} />
            <div className="mt-8">
              <Pagination total={articlesCount} limit={10} />
            </div>
          </div>
          <div className="hidden lg:block lg:w-64">
            <div className="lg:sticky lg:top-24">
              <SelectTag tags={tags} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
