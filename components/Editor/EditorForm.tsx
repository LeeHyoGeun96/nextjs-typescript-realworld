"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button/Button";
import TagList from "../ui/tag/TagList";
import { ArticleType, updateArticleState } from "@/types/articleTypes";
import { createArticle, updateArticle } from "@/actions/article";
import { ErrorDisplay } from "../ErrorDisplay";
import { Input } from "../Input";

interface EditorFormProps {
  initialData?: ArticleType;
  slug?: string;
}

export function EditorForm({ initialData, slug }: EditorFormProps) {
  const router = useRouter();
  const initialInputData = initialData
    ? {
        ...initialData,
      }
    : {
        title: "",
        description: "",
        body: "",
        tagList: [],
      };

  const actionFunction = slug
    ? (state: updateArticleState, formData: FormData) => {
        return updateArticle(state, formData, slug);
      }
    : createArticle;

  const [state, formAction, isPending] = useActionState(actionFunction, {
    success: false,
    error: null,
    value: {
      inputData: initialInputData,
    },
  });

  const [tagInput, setTagInput] = useState("");
  const [tagList, setTagList] = useState<string[]>(initialInputData.tagList);

  const MAX_TAG_COUNT = 10;
  const isMaxTag = tagList.length > MAX_TAG_COUNT;

  useEffect(() => {
    if (state.success) {
      if (slug) {
        router.push(`/article/${slug}`);
      } else {
        router.push("/");
      }
    }
  }, [state.success, slug, router]);

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (tagInput.length === 0) return;
    if (isMaxTag) return;
    if (e.key === "Enter") {
      e.preventDefault(); // 폼 제출 방지
      const tag = tagInput.trim();
      if (tag && !tagList.includes(tag)) {
        // 중복 태그 방지
        setTagList([...tagList, tag]);
        setTagInput("");
      }
    }
  };

  const handleDeleteTag = (tag: string) => {
    setTagList(tagList.filter((t) => t !== tag));
  };

  return (
    <form action={formAction} className="space-y-6">
      <ErrorDisplay message={state.error?.message} />

      <div className="space-y-4">
        <Input
          type="text"
          name="title"
          placeholder="제목을 입력해주세요"
          defaultValue={state.value?.inputData?.title}
          className="w-full p-2 border rounded"
          required
        />

        <Input
          type="text"
          name="description"
          placeholder="이 게시글에 대해 설명해주세요"
          defaultValue={state.value?.inputData?.description}
          className="w-full p-2 border rounded"
          required
        />

        <Input
          isTextArea
          name="body"
          placeholder="내용을 입력해주세요"
          defaultValue={state.value?.inputData?.body}
          className="w-full p-2 border rounded min-h-[200px]"
          required
        />

        <Input
          type="text"
          value={tagInput}
          onChange={handleTagInputChange}
          onKeyDown={handleTagKeyDown}
          className="w-full p-2 border rounded"
          disabled={isMaxTag}
          placeholder={
            isMaxTag
              ? `태그는 최대 ${MAX_TAG_COUNT}개까지 입력할 수 있습니다.`
              : `태그를 입력해주세요.`
          }
        />

        <TagList
          tags={tagList}
          mode="edit"
          onDeleteTag={handleDeleteTag}
          showUnfilterButton={false}
        />

        <input type="hidden" name="tagList" value={JSON.stringify(tagList)} />
      </div>

      <div className="text-right">
        <Button type="submit" variant="primary" disabled={isPending}>
          {slug ? "Update" : "Publish"} Article
        </Button>
      </div>
    </form>
  );
}
