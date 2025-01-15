import { QueryClient } from "@tanstack/react-query";
import TagInput from "../components/TagForm";
import { useTagInput } from "../hooks/useTagInput";
import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  redirect,
  useActionData,
  useLoaderData,
  useParams,
  useSubmit,
} from "react-router-dom";
import { articleService } from "../services/article.service";
import { useUserStore } from "../store/userStore";
import NetworkError from "../errors/NetworkError";
import { articleQueryOptions } from "../queryOptions/articleQueryOptions";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { ArticleType } from "../types/articleTypes";
import { deepEqual } from "../util/deepEqual";
import { useEffect, useState } from "react";
import { Input } from "../components/Input";

export const loader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    if (!params.slug) {
      return new NetworkError({ code: 404, message: "slug가 필요합니다." });
    }

    const { token } = useUserStore.getState();

    if (!token) {
      return new NetworkError({ code: 401, message: "로그인이 필요합니다." });
    }

    try {
      const response = await queryClient.fetchQuery(
        articleQueryOptions.getArticle({ slug: params.slug, token })
      );

      const article = response.article;

      if (Object.keys(article.author).length === 0) {
        return new NetworkError({
          code: 404,
          message: "게시글을 찾을 수 없습니다.",
        });
      }

      return article;
    } catch (error) {
      if (NetworkError.isNetworkError(error)) {
        return error;
      }
      throw error;
    }
  };

export const action =
  (queryClient: QueryClient) =>
  async ({ request, params }: ActionFunctionArgs) => {
    const formData = await request.formData();

    const articleData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      body: formData.get("body") as string,
      tagList: JSON.parse(formData.get("tagList") as string),
    };
    const { token } = useUserStore.getState();

    if (!token) {
      return new NetworkError({ code: 401, message: "로그인이 필요합니다." });
    }

    try {
      if (params.slug) {
        // 수정
        const response = await articleService.updateArticle({
          slug: params.slug,
          article: articleData,
          token,
        });
        await queryClient.invalidateQueries({ queryKey: ["articles"] });
        return redirect(`/article/${response.article.slug}`);
      } else {
        // 생성
        await articleService.createArticle({
          article: articleData,
          token,
        });
        await queryClient.invalidateQueries({ queryKey: ["articles"] });
        return redirect(`/`);
      }
    } catch (error) {
      if (NetworkError.isNetworkError(error)) {
        return error;
      }
      throw error;
    }
  };

const EditorPage = () => {
  const { slug } = useParams();
  const loaderData = slug ? (useLoaderData() as ArticleType) : null;
  const actionData = useActionData() as NetworkError | undefined;
  const [error, setError] = useState<NetworkError | undefined>(undefined);
  const submit = useSubmit();

  useEffect(() => {
    const loaderError = NetworkError.isNetworkError(loaderData)
      ? loaderData
      : undefined;
    setError(actionData || loaderError);
  }, [actionData, loaderData]);

  const article = loaderData || {
    title: "",
    description: "",
    body: "",
    tagList: [],
  };

  const { tags, addTag, removeTag } = useTagInput(article.tagList);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const articleData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      body: formData.get("body") as string,
      tagList: JSON.parse(formData.get("tagList") as string),
    };

    const isNotChanged = deepEqual(articleData, loaderData, [
      "title",
      "description",
      "body",
      "tagList",
    ]);

    if (isNotChanged) {
      window.alert("변경사항이 있어야 합니다");
      return;
    }

    submit(formData, {
      method: "post",
    });
  };

  return (
    <main className="bg-white dark:bg-gray-900 py-8 ">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="sr-only">글 {slug ? "수정" : "작성"}</h2>
          {error && <ErrorDisplay errors={error} />}

          <Form method="post" onSubmit={handleSubmit} className="space-y-6">
            <fieldset>
              <legend className="sr-only">글 정보 입력</legend>

              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="sr-only">
                    제목
                  </label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Article Title"
                    defaultValue={article.title}
                    name="title"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="sr-only">
                    설명
                  </label>
                  <Input
                    id="description"
                    type="text"
                    placeholder="What's this article about?"
                    defaultValue={article.description}
                    name="description"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="body" className="sr-only">
                    본문
                  </label>
                  <Input
                    id="body"
                    isTextArea
                    placeholder="Write your article"
                    defaultValue={article.body}
                    name="body"
                    className="min-h-[200px]"
                    required
                  />
                </div>

                <TagInput
                  tags={tags}
                  onAddTag={addTag}
                  onRemoveTag={removeTag}
                />

                <input
                  type="hidden"
                  name="tagList"
                  value={JSON.stringify(tags)}
                />
              </div>

              <div className="mt-6 text-right">
                <button
                  className="px-6 py-2 text-white bg-brand-primary rounded-lg hover:bg-brand-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 transition-colors"
                  type="submit"
                >
                  Publish Article
                </button>
              </div>
            </fieldset>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default EditorPage;
