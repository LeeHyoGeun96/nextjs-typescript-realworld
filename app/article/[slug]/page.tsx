import ArticleContent from "@/components/Article/ArticleContent";
import { Params } from "@/types/global";
import { optionalAuthHeaders } from "@/utils/auth/optionalAuthHeaders";
import { cookies } from "next/headers";

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const headers = optionalAuthHeaders(token);

  const articleResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/articles/${slug}`,
    {
      headers,
    }
  ).then((res) => res.json());

  const article = articleResponse.article;

  const profileKey = `/api/profiles/${article.author.username}`;
  const commentsKey = `/api/articles/${slug}/comments`;
  const articleKey = `/api/articles/${slug}`;

  const apiKeys = {
    profile: profileKey,
    comments: commentsKey,
    article: articleKey,
  } as const;

  const [profile, comments] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiKeys.profile}`, {
      headers,
    }).then((res) => res.json()),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiKeys.comments}`, {
      headers,
    }).then((res) => res.json()),
  ]);

  const fallback = {
    [apiKeys.profile]: profile,
    [apiKeys.comments]: comments,
    [apiKeys.article]: articleResponse,
  };

  return <ArticleContent apiKeys={apiKeys} initialData={fallback} />;
}
