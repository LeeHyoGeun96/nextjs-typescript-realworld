"use client";

import { ArticleResponse } from "@/types/articleTypes";
import { ProfileResponse } from "@/types/profileTypes";
import Link from "next/link";
import useSWR from "swr";
import Avatar from "../ui/Avata/Avatar";
import ArticleActions from "./ArticleActions";
import CommentsContainer from "@/components/Comments/index";

import { useRouter } from "next/navigation";
import {
  deleteArticle,
  favoriteArticle,
  unfavoriteArticle,
} from "@/actions/article";
import TagList from "../ui/tag/TagList";
import { followUser, unfollowUser } from "@/actions/profile";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";

import {
  handleApiError,
  handleUnexpectedError,
} from "@/utils/error/errorHandle";

export type ArticleKeys = {
  article: string;
  comments: string;
  profile: string;
};
interface ArticleProps {
  apiKeys: ArticleKeys;
}

export default function ArticleContent({ apiKeys }: ArticleProps) {
  const { data: articleResponse, mutate: mutateArticle } =
    useSWR<ArticleResponse>(apiKeys.article);
  const { isLoggedIn } = useUser();

  const articleData = articleResponse?.article;

  const {
    data: profileResponse,
    mutate: mutateProfile,
    isLoading: isProfileLoading,
  } = useSWR<ProfileResponse>(apiKeys.profile);
  const router = useRouter();
  const [unExpectedError, setUnExpectedError] = useState<string | null>(null);

  if (!articleData) {
    return <div>해당 글이 없습니다.</div>;
  }

  if (!profileResponse) {
    return <div>존재하지 않는 사용자의 글입니다.</div>;
  }

  if (unExpectedError) {
    throw new Error(unExpectedError);
  }

  const profile = profileResponse?.profile;

  const handleFavorite = async (slug: string, favorited: boolean) => {
    if (!isLoggedIn) {
      const confirm = window.confirm(
        "로그인 후 이용해주세요. 로그인하러 가시겠습니까?"
      );
      if (!confirm) return;
      router.push("/login");
      return;
    }

    await mutateArticle(
      async () => {
        if (favorited) {
          try {
            const unfavoriteResponse = await unfavoriteArticle(slug);
            handleApiError(
              unfavoriteResponse,
              "좋아요 삭제 처리에 실패했습니다."
            );
            return {
              ...articleResponse,
              article: {
                ...articleResponse.article,
                favoritesCount: articleResponse.article.favoritesCount - 1,
                favorited: false,
              },
            };
          } catch (error) {
            handleUnexpectedError(
              error,
              "좋아요 삭제 처리",
              setUnExpectedError
            );
          }
        } else {
          try {
            const favoriteResponse = await favoriteArticle(slug);
            handleApiError(
              favoriteResponse,
              "좋아요 추가 처리에 실패했습니다."
            );
            return {
              ...articleResponse,
              article: {
                ...articleResponse.article,
                favoritesCount: articleResponse.article.favoritesCount + 1,
                favorited: true,
              },
            };
          } catch (error) {
            handleUnexpectedError(
              error,
              "좋아요 추가 처리",
              setUnExpectedError
            );
          }
        }
      },
      {
        optimisticData: () => {
          if (!articleResponse) return articleResponse;
          if (favorited) {
            return {
              ...articleResponse,
              article: {
                ...articleResponse.article,
                favoritesCount: articleResponse.article.favoritesCount - 1,
                favorited: false,
              },
            };
          } else {
            return {
              ...articleResponse,
              article: {
                ...articleResponse.article,
                favoritesCount: articleResponse.article.favoritesCount + 1,
                favorited: true,
              },
            };
          }
        },
        rollbackOnError: true,
        revalidate: false,
        populateCache: true,
      }
    );
  };

  const handleFollow = async (following: boolean, username: string) => {
    if (isProfileLoading) return;
    if (!isLoggedIn) {
      const confirm = window.confirm(
        "로그인 후 이용해주세요. 로그인하러 가시겠습니까?"
      );
      if (!confirm) return;
      router.push("/login");
      return;
    }

    await mutateProfile(
      async () => {
        if (following) {
          try {
            const response = await unfollowUser(username);
            handleApiError(response, "언팔로우 처리에 실패했습니다.");
            return response.value?.responseData;
          } catch (error) {
            handleUnexpectedError(error, "언팔로우 처리", setUnExpectedError);
          }
        } else {
          try {
            const response = await followUser(username);
            handleApiError(response, "팔로우 처리에 실패했습니다.");
            return response.value?.responseData;
          } catch (error) {
            handleUnexpectedError(error, "팔로우 처리", setUnExpectedError);
          }
        }
      },
      {
        optimisticData: () => {
          if (following) {
            return {
              ...profileResponse,
              profile: {
                ...profileResponse.profile,
                following: false,
              },
            };
          } else {
            return {
              ...profileResponse,
              profile: {
                ...profileResponse.profile,
                following: true,
              },
            };
          }
        },
        rollbackOnError: true,
        revalidate: false,
      }
    );
  };

  const handleDelete = async () => {
    if (!isLoggedIn) {
      const confirm = window.confirm(
        "로그인 후 이용해주세요. 로그인하러 가시겠습니까?"
      );
      if (!confirm) return;
      router.push("/login");
    }

    const confirm = window.confirm("정말 삭제하시겠습니까?");
    if (!confirm) return;

    try {
      const deleteResponse = await deleteArticle(articleData?.slug);
      handleApiError(deleteResponse, "삭제 처리에 실패했습니다.");
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push("/");
      }
    } catch (error) {
      handleUnexpectedError(error, "삭제 처리", setUnExpectedError);
    }
  };

  return (
    <article className="article-page">
      <header className="bg-gray-700 dark:bg-gray-800 shadow-sm py-8">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-semibold text-white">
            {articleData?.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <section className="flex items-center">
              <Link
                href={`/profile/${articleData?.author.username}`}
                aria-label={`${articleData?.author.username}의 프로필로 이동`}
              >
                <Avatar
                  user={{
                    username: articleData?.author.username || "",
                    image: articleData?.author.image || "",
                  }}
                  size="md"
                  className="mr-2 "
                />
              </Link>
              <div className="mr-6">
                <Link
                  href={`/profile/${articleData?.author.username}`}
                  className="text-brand-primary hover:text-brand-primary/90 font-medium"
                >
                  {articleData?.author.username}
                </Link>
                <time
                  className="text-gray-500 text-sm block"
                  dateTime={articleData?.createdAt?.toString() || ""}
                >
                  {new Date(articleData?.createdAt || "").toLocaleDateString(
                    "ko-KR"
                  )}
                </time>
              </div>
            </section>

            <div className="flex items-center flex-wrap gap-4">
              <ArticleActions
                article={articleData}
                profile={profile}
                onFavorite={handleFavorite}
                onFollow={handleFollow}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="prose dark:prose-invert max-w-none">
          <div className="mb-8">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {articleData?.body}
            </p>
          </div>

          <div className="mt-4">
            <TagList
              tags={articleData?.tagList}
              showUnfilterButton={false}
              mode="filter"
            />
          </div>
        </section>

        <hr className="my-8 border-gray-200 dark:border-gray-700" />

        <section aria-label="댓글">
          {/* 댓글 컴포넌트는 클라이언트 컴포넌트로 분리 필요 */}
          <div className="text-center py-4">
            <CommentsContainer slug={articleData?.slug} apiKeys={apiKeys} />
          </div>
        </section>
      </main>
    </article>
  );
}
