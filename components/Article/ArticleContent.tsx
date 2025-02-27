"use client";

import { ArticleResponse, CommentType } from "@/types/articleTypes";
import { ProfileResponse } from "@/types/profileTypes";
import Link from "next/link";
import useSWR from "swr";
import Avatar from "../ui/Avata/Avatar";
import ArticleActions from "./ArticleActions";

import { useRouter } from "next/navigation";
import { favoriteArticle, unfavoriteArticle } from "@/actions/article";
import TagList from "../ui/tag/TagList";
import { followUser, unfollowUser } from "@/actions/profile";

interface ArticleProps {
  keys: {
    article: string;
    comments: string;
    profile: string;
  };
  isLoggedIn: boolean;
}

export default function ArticleContent({ keys, isLoggedIn }: ArticleProps) {
  const {
    data: articleResponse,
    mutate: mutateArticle,
    isLoading: isArticleLoading,
  } = useSWR<ArticleResponse>(keys.article);

  const articleData = articleResponse?.article;
  const { data: comments } = useSWR<CommentType[]>(keys.comments);
  const {
    data: profileResponse,
    mutate: mutateProfile,
    isLoading: isProfileLoading,
  } = useSWR<ProfileResponse>(keys.profile);
  const router = useRouter();

  if (!articleData) {
    return <div>해당 글이 없습니다.</div>;
  }

  if (!profileResponse) {
    return <div>존재하지 않는 사용자의 글입니다.</div>;
  }

  const handleFavorite = async (slug: string, favorited: boolean) => {
    if (isArticleLoading) return;
    if (!isLoggedIn) {
      const confirm = window.confirm(
        "로그인 후 이용해주세요. 로그인하러 가시겠습니까?"
      );
      if (!confirm) return;
      router.push("/login");
      return;
    }

    await mutateArticle(
      async (prevData: ArticleResponse | undefined) => {
        if (!prevData) return articleResponse;

        if (favorited) {
          await unfavoriteArticle(slug);
          return {
            ...prevData,
            article: {
              ...prevData.article,
              favoritesCount: prevData.article.favoritesCount - 1,
              favorited: !favorited,
            },
          };
        } else {
          await favoriteArticle(slug);
          return {
            ...prevData,
            article: {
              ...prevData.article,
              favoritesCount: prevData.article.favoritesCount + 1,
              favorited: !favorited,
            },
          };
        }
      },
      {
        optimisticData: (prevData: ArticleResponse | undefined) => {
          if (!prevData) return articleResponse;
          if (favorited) {
            return {
              ...prevData,
              article: {
                ...prevData.article,
                favoritesCount: prevData.article.favoritesCount - 1,
                favorited: !favorited,
              },
            };
          } else {
            return {
              ...prevData,
              article: {
                ...prevData.article,
                favoritesCount: prevData.article.favoritesCount + 1,
                favorited: !favorited,
              },
            };
          }
        },
        rollbackOnError: true,
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
      async (prevData: ProfileResponse | undefined) => {
        if (!prevData) return profileResponse;
        if (following) {
          const response = await unfollowUser(username);
          return response;
        } else {
          const response = await followUser(username);
          return response;
        }
      },
      {
        optimisticData: (prevData: ProfileResponse | undefined) => {
          if (!prevData) return profileResponse;
          if (following) {
            return {
              ...prevData,
              profile: {
                ...prevData.profile,
                following: false,
              },
            };
          } else {
            return {
              ...prevData,
              profile: {
                ...prevData.profile,
                following: true,
              },
            };
          }
        },
        rollbackOnError: true,
      }
    );
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
                  username={articleData?.author.username || ""}
                  image={articleData?.author.image}
                  size="md"
                  className="mr-2"
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
                  dateTime={articleData?.createdAt.toString() || ""}
                >
                  {new Date(articleData?.createdAt || "").toLocaleDateString(
                    "ko-KR"
                  )}
                </time>
              </div>
            </section>

            {/* 버튼 부분은 클라이언트 컴포넌트로 분리해야 함 */}
            <div className="flex items-center flex-wrap gap-4">
              <ArticleActions
                article={articleData}
                profile={profileResponse?.profile}
                onFavorite={handleFavorite}
                onFollow={handleFollow}
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
            <TagList tags={articleData?.tagList} showDeleteButton={false} />
          </div>
        </section>

        <hr className="my-8 border-gray-200 dark:border-gray-700" />

        <section aria-label="댓글">
          {/* 댓글 컴포넌트는 클라이언트 컴포넌트로 분리 필요 */}
          <div className="text-center py-4">
            <h3 className="text-xl font-medium mb-4">댓글</h3>
            <div className="text-sm text-gray-500">
              댓글 기능은 클라이언트 컴포넌트로 구현 필요
            </div>
          </div>
        </section>
      </main>
    </article>
  );
}
