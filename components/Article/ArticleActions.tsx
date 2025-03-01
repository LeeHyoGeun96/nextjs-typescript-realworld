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
            <i className="ion-edit" aria-hidden="true"></i> Edit Article
          </Link>
          <button
            className="btn-outline-red"
            type="submit"
            onClick={handleDelete}
            aria-label="글 삭제하기"
          >
            <i className="ion-trash-a" aria-hidden="true"></i> Delete Article
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
            {following ? "Unfollow" : "Follow"} {article.author.username}
          </span>
        </button>
      )}
    </nav>
  );
}

{
  /* <nav className="flex items-center flex-wrap gap-4" aria-label="글 관련 작업">
  <button
    className={
      "btn btn-sm border border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
    }
    onClick={article.favorited ? handleUnfavorite : handleFavorite}
    disabled={favoriteMutations?.isPending || false}
    aria-pressed={article.favorited}
  >
    <span className="inline-flex items-center">
      <i
        className="ion-heart mr-[2px] self-center translate-y-[1px]"
        aria-hidden="true"
      ></i>
      <span>
        {article.favorited ? "Unfavorite" : "Favorite"} Post{" "}
        <span className="counter">({article.favoritesCount})</span>
      </span>
    </span>
  </button>
  {!isSameUser && (
    <button
      className="btn btn-sm border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
      disabled={followMutations?.isPending || false}
      onClick={profileData?.profile.following ? handleUnfollow : handleFollow}
      aria-pressed={profileData?.profile.following}
    >
      <i className="ion-plus-round mr-[1px]" aria-hidden="true"></i>
      <span>
        {profileData?.profile.following ? "Unfollow" : "Follow"}{" "}
        {article.author.username}
      </span>
    </button>
  )}
  {isSameUser && (
    <>
      <Link
        to={`/editor/${article.slug}`}
        className="btn btn-sm border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
        aria-label="글 수정하기"
      >
        <i className="ion-edit" aria-hidden="true"></i> Edit Article
      </Link>
      <Form
        method="post"
        action={`/deleteArticle/${article.slug}`}
        className="inline-block"
      >
        <button
          className="btn btn-sm border border-red-700 text-red-700 hover:bg-red-700 hover:text-white"
          type="submit"
          aria-label="글 삭제하기"
        >
          <i className="ion-trash-a" aria-hidden="true"></i> Delete Article
        </button>
      </Form>
    </>
  )}
</nav>; */
}
