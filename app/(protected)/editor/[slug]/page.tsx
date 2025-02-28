import { EditorForm } from "@/components/Editor/EditorForm";
import { ArticleResponse } from "@/types/articleTypes";
import { ResponseUserType } from "@/types/authTypes";
import { Params } from "@/types/global";
import { optionalAuthHeaders } from "@/utils/auth/optionalAuthHeaders";
import { cookies } from "next/headers";

interface EditorPageProps {
  params: Promise<Params>;
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const headers = optionalAuthHeaders(token);

  const [articleResponse, userResponse]: [ArticleResponse, ResponseUserType] =
    await Promise.all([
      // 게시글 정보 요청
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${slug}`, {
        headers,
      }).then((res) => res.json()),

      // 현재 사용자 정보 요청
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, { headers }).then(
        (res) => res.json()
      ),
    ]);

  if (articleResponse.article.author.username !== userResponse.user.username) {
    throw new Error("게시물을 수정할 수 있는 권한이 없습니다.");
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Edit Article</h1>
      <EditorForm initialData={articleResponse.article} slug={slug} />
    </>
  );
}
