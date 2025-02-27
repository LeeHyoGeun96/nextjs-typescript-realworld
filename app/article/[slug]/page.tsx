import ArticleContent from "@/components/Article/ArticleContent";
import SWRProvider from "@/lib/swr/SWRProvider";
import { ArticleResponse, CommentsResponse } from "@/types/articleTypes";
import { Params } from "@/types/global";
import { ProfileResponse } from "@/types/profileTypes";
import { optionalAuthHeaders } from "@/utils/auth/optionalAuthHeaders";
import { cookies } from "next/headers";

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const headers = optionalAuthHeaders(token);

  const articleResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/articles/${slug}`,
    {
      headers,
    }
  ).then((res) => res.json());

  const article = articleResponse.article;

  const [profile, comments] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${article.author.username}`,
      {
        headers,
      }
    ).then((res) => res.json()),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${slug}/comments`, {
      headers,
    }).then((res) => res.json()),
  ]);

  const profileKey = `/api/profiles/${article.author.username}`;
  const commentsKey = `/api/articles/${slug}/comments`;
  const articleKey = `/api/articles/${slug}`;

  const keys = {
    profile: profileKey,
    comments: commentsKey,
    article: articleKey,
  };

  type ArticleFallback = {
    [key: string]: {
      profile: ProfileResponse;
      comments: CommentsResponse;
      article: ArticleResponse;
    };
  };

  return (
    <SWRProvider<ArticleFallback>
      fallback={{
        [keys.profile]: profile,
        [keys.comments]: comments,
        [keys.article]: articleResponse,
      }}
    >
      <ArticleContent keys={keys} />
    </SWRProvider>
  );
}
