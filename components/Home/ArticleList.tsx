"use client";

import Link from "next/link";
import FavoriteButton from "../ui/FavoriteButton";
import Avatar from "../ui/Avata/Avatar";
import useSWR from "swr";
import { ArticleInterfaceType, ArticleType } from "@/types/articleTypes";
import { favoriteArticle, unfavoriteArticle } from "@/actions/article";

import TagList from "../ui/tag/TagList";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";

interface ArticleListProps {
  apiQueryString: string;
  tab: string;
}

export default function ArticleList({ apiQueryString, tab }: ArticleListProps) {
  const apiUrl =
    tab === "personal"
      ? `/api/articles/feed?${apiQueryString}`
      : `/api/articles?${apiQueryString}`;

  const { data, error, isLoading, mutate } = useSWR(apiUrl);
  const { articles } = data;
  const { isLoggedIn } = useUser();
  const router = useRouter();

  if (error) {
    throw Error("데이터를 불러오는데 실패했습니다.");
  }

  if (articles.length === 0) {
    return (
      <p className="text-center text-gray-500 py-4" role="status">
        데이터가 없습니다.
      </p>
    );
  }

  const handleFavorite = async (slug: string, favorited: boolean) => {
    if (isLoading) return;
    if (!isLoggedIn) {
      const confirm = window.confirm(
        "로그인 후 이용해주세요. 로그인하러 가시겠습니까?"
      );
      if (!confirm) return;
      router.push("/login");
      return;
    }

    await mutate(
      async (prevData: ArticleInterfaceType | undefined) => {
        if (favorited) {
          await unfavoriteArticle(slug);
          return {
            ...prevData,
            articles: prevData?.articles.map((article) =>
              article.slug === slug
                ? { ...article, favoritesCount: article.favoritesCount - 1 }
                : article
            ),
          };
        } else {
          await favoriteArticle(slug);
          return {
            ...prevData,
            articles: prevData?.articles.map((article) =>
              article.slug === slug
                ? { ...article, favoritesCount: article.favoritesCount + 1 }
                : article
            ),
          };
        }
      },
      {
        optimisticData: (prevData: ArticleInterfaceType | undefined) => {
          if (favorited) {
            return {
              ...prevData,
              articles: prevData?.articles.map((article) =>
                article.slug === slug
                  ? { ...article, favoritesCount: article.favoritesCount - 1 }
                  : article
              ),
            };
          } else {
            return {
              ...prevData,
              articles: prevData?.articles.map((article) =>
                article.slug === slug
                  ? { ...article, favoritesCount: article.favoritesCount + 1 }
                  : article
              ),
            };
          }
        },
        rollbackOnError: true,
      }
    );
  };

  return (
    <section
      aria-label="게시글 목록"
      className="divide-y divide-gray-200 dark:divide-gray-700"
    >
      {articles.map((article: ArticleType) => (
        <article key={article.slug} className="py-6">
          <header className="flex items-center mb-4">
            <Link
              href={`/profile/${article.author.username}`}
              className="flex-shrink-0"
              aria-label={`${article.author.username}의 프로필로 이동`}
            >
              <Avatar
                username={article.author.username || ""}
                image={article.author.image}
                size="md"
                className="mr-1"
              />
            </Link>
            <div className="flex flex-col ml-3 flex-grow">
              <Link
                href={`/profile/${article.author.username}`}
                className="text-brand-primary hover:text-brand-secondary font-medium"
              >
                {article.author.username}
              </Link>
              <time
                dateTime={new Date(article.createdAt).toISOString()}
                className="text-gray-500 dark:text-gray-400 text-sm"
              >
                {new Date(article.createdAt).toISOString().split("T")[0]}
              </time>
            </div>
            <FavoriteButton
              favorited={article.favorited}
              favoritesCount={article.favoritesCount}
              handleFavorite={handleFavorite}
              slug={article.slug}
            />
          </header>
          <div className="article-content">
            <Link
              href={`/article/${article.slug}`}
              className="block group"
              aria-label={`${article.title} 게시글 읽기`}
            >
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-brand-primary">
                {article.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {article.description}
              </p>
              <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap">
                <span className="text-brand-primary text-sm mb-2 sm:mb-0">
                  Read more...
                </span>
                {article.tagList.length > 0 && (
                  <TagList
                    tags={article.tagList}
                    showDeleteButton={false}
                    className="flex-wrap"
                  />
                )}
              </footer>
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}
