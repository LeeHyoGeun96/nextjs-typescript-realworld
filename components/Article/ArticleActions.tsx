"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { ProfileType } from "@/types/profileTypes";
import { ArticleType } from "@/types/articleTypes";
import FavoriteButton from "../ui/FavoriteButton";

interface ArticleActionsProps {
  article: ArticleType;
  profile: ProfileType;
  onFavorite: (slug: string, favorited: boolean) => void;
  onFollow: (following: boolean, username: string) => void;
  onDelete: () => void;
}

export default function ArticleActions({
  article,
  profile,
  onFavorite,
  onFollow,
  onDelete,
}: ArticleActionsProps) {
  const router = useRouter();
  const { isLoggedIn } = useUser();
  const { favorited, favoritesCount } = article;
  const { following, isMe: isSameUser } = profile;

  const confirmLogin = () => {
    const confirmed = window.confirm(
      "로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?"
    );
    if (confirmed) {
      router.push("/login");
    }
  };

  const handleFavorite = async (slug: string, favorited: boolean) => {
    if (!isLoggedIn) {
      confirmLogin();
      return;
    }
    onFavorite(slug, favorited);
  };

  const handleFollow = async (following: boolean, username: string) => {
    if (!isLoggedIn) {
      confirmLogin();
      return;
    }
    onFollow(following, username);
  };

  const handleDelete = async () => {
    if (!isLoggedIn) {
      confirmLogin();
      return;
    }
    onDelete();
  };

  return (
    <nav
      className="flex items-center flex-wrap gap-4"
      aria-label="글 관련 작업"
    >
      <FavoriteButton
        favorited={favorited}
        favoritesCount={favoritesCount}
        handleFavorite={handleFavorite}
        slug={article.slug}
      />
      {isSameUser ? (
        <>
          <Link
            href={`/editor/${article.slug}`}
            className="btn-outline-blue"
            aria-label="글 수정하기"
          >
            <i className="ion-edit" aria-hidden="true"></i> 글 수정
          </Link>
          <button
            className="btn-outline-red"
            type="submit"
            onClick={handleDelete}
            aria-label="글 삭제하기"
          >
            <i className="ion-trash-a" aria-hidden="true"></i> 글 삭제
          </button>
        </>
      ) : (
        <button
          className="btn-outline-blue"
          onClick={() => handleFollow(following, article.author.username)}
          aria-pressed={following}
        >
          <i className="ion-plus-round mr-[1px]" aria-hidden="true"></i>
          <span>
            {following ? "언팔로우" : "팔로우"} {article.author.username}
          </span>
        </button>
      )}
    </nav>
  );
}
