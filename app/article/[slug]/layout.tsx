import { ArticleResponse } from "@/types/articleTypes";
import { Params } from "@/types/global";
import { optionalAuthHeaders } from "@/utils/auth/optionalAuthHeaders";
import { Metadata } from "next";
import { cookies } from "next/headers";

// 동적 메타데이터 생성 함수
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const headers = optionalAuthHeaders(token);

  // 게시글 데이터 가져오기
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/articles/${slug}`;
  const articleResponse = await fetch(apiUrl, {
    headers,
  }).then((res) => res.json() as Promise<ArticleResponse>);
  const { article } = articleResponse;

  // 게시글 정보로 메타데이터 생성
  return {
    title: `${article.title}`,
    description: article.description || `${article.author.username}의 게시글`,
    authors: [
      {
        name: article.author.username,
        url: `/profile/${article.author.username}`,
      },
    ],
    openGraph: {
      title: article.title,
      description: article.description || `${article.author.username}의 게시글`,
      type: "article",
      publishedTime: new Date(article.createdAt).toLocaleString("ko-KR"),
      modifiedTime: new Date(article.updatedAt).toLocaleString("ko-KR"),
      authors: [
        `${process.env.NEXT_PUBLIC_SITE_URL}/profile/${article.author.username}`,
      ],
      images: [
        {
          url:
            article.author.image ||
            `${process.env.NEXT_PUBLIC_SITE_URL}/default-og-image.jpg`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [
        article.author.image ||
          `${process.env.NEXT_PUBLIC_SITE_URL}/default-og-image.jpg`,
      ],
    },
  };
}

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
