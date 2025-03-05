"use client";

import { useState } from "react";
import useSWR from "swr";
import { useUser } from "@/hooks/useUser";
import { CommentsResponse } from "@/types/articleTypes";
import { Comments } from "./Comments";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";
import { CommentCard } from "./CommentCard";
import { addComment, deleteComment } from "@/actions/article";
import { ArticleKeys } from "../Article/ArticleContent";
import {
  handleApiError,
  handleUnexpectedError,
} from "@/utils/error/errorHandle";

interface CommentsProps {
  slug: string;
  apiKeys: ArticleKeys;
  initialData: Record<string, unknown>;
}

export default function CommentsContainer({
  slug,
  apiKeys,
  initialData,
}: CommentsProps) {
  const { user, isLoggedIn } = useUser();
  const {
    data: CommentsResponse,
    mutate,
    isLoading: CommentsLoading,
  } = useSWR<CommentsResponse>(apiKeys.comments, {
    fallbackData: initialData[apiKeys.comments] as CommentsResponse,
  });

  const comments = CommentsResponse?.comments;

  const [commentText, setCommentText] = useState("");
  const [unexpectError, setUnexpectError] = useState<string | null>(null);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };

  if (unexpectError) {
    throw new Error(unexpectError);
  }

  const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
    if (CommentsLoading) return;
    if (!commentText.trim()) return;

    e.preventDefault();
    if (!isLoggedIn) {
      const confirm = window.confirm(
        "로그인 후 이용해주세요. 로그인하러 가시겠습니까?"
      );
      if (!confirm) return;
      window.location.href = "/login";
      return;
    }

    // 낙관적 업데이트
    const optimisticComment = {
      id: Date.now(), // 임시 ID
      body: commentText,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: {
        username: user?.username || "",
        bio: user?.bio || null,
        image: user?.image || null,
        following: false,
      },
    };

    await mutate(
      async (prevData: CommentsResponse | undefined) => {
        try {
          const commentResponse = await addComment(commentText, slug);
          handleApiError(commentResponse, "댓글 추가에 실패했습니다.");
          const comment = commentResponse.value?.responseData?.comment;
          if (!comment) {
            throw new Error("예상치 못한 에러로 댓글 추가에 실패했습니다.");
          }

          return {
            comments: [comment, ...(prevData?.comments || [])],
          };
        } catch (error) {
          handleUnexpectedError(error, "댓글 추가", setUnexpectError);
        }
      },
      {
        optimisticData: (prevData) => {
          if (!prevData) return { comments: [optimisticComment] };
          return {
            comments: [optimisticComment, ...prevData.comments],
          };
        },
        rollbackOnError: true,
        revalidate: false,
      }
    );
    setCommentText("");
  };

  const handleDeleteComment = async (id: number) => {
    if (!isLoggedIn) {
      const confirm = window.confirm(
        "로그인 후 이용해주세요. 로그인하러 가시겠습니까?"
      );
      if (!confirm) return;
      window.location.href = "/login";
      return;
    }

    // 낙관적 업데이트
    await mutate(
      async (prevData) => {
        if (!prevData) return { comments: [] };
        try {
          const deleteResponse = await deleteComment(id, slug);
          handleApiError(deleteResponse, "댓글 삭제에 실패했습니다.");
          return {
            comments: prevData.comments.filter((comment) => comment.id !== id),
          };
        } catch (error) {
          handleUnexpectedError(error, "댓글 삭제", setUnexpectError);
        }
      },
      {
        optimisticData: (prevData) => {
          if (!prevData) return { comments: [] };
          return {
            comments: prevData.comments.filter((comment) => comment.id !== id),
          };
        },
        rollbackOnError: true,
        revalidate: false,
      }
    );
  };

  return (
    <Comments>
      <CommentForm
        onSubmit={handleAddComment}
        disabled={CommentsLoading}
        value={commentText}
        onChange={handleCommentChange}
      />

      <CommentList>
        {!comments || comments.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            첫 댓글을 작성해보세요!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onDelete={() => handleDeleteComment(comment.id)}
              canModify={user?.username === comment.author.username}
            />
          ))
        )}
      </CommentList>
    </Comments>
  );
}
