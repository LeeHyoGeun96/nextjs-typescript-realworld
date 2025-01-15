import { useQuery } from "@tanstack/react-query";
import { articleQueryOptions } from "../queryOptions/articleQueryOptions";
import { useUserStore } from "../store/userStore";
import { useState } from "react";
import useCommentMutations from "../hooks/useCommentMutations";
import CommentForm from "./CommentForm";
import CommentCard from "./CommentCard";
import { useLoginConfirm } from "../hooks/useLoginConfirm";

const Comments = ({ slug }: { slug: string }) => {
  const [commentText, setCommentText] = useState("");
  const { token, user: loggedInUser } = useUserStore();
  const { data, isPending: isCommentsPending } = useQuery(
    articleQueryOptions.getComments({ slug, token: token ?? undefined })
  );
  const confirmLogin = useLoginConfirm();
  const commentMutations = token
    ? useCommentMutations({
        token,
        slug,
      })
    : null;

  const handleAddComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!commentMutations) {
      confirmLogin();
      return;
    }
    if (commentText.trim() === "") {
      return;
    }
    commentMutations.addCommentMutation.mutate(commentText);
    setCommentText("");
  };

  const handleDeleteComment = (id: number) => {
    if (!commentMutations) {
      confirmLogin();
      return;
    }
    commentMutations.deleteCommentMutation.mutate(id);
  };

  if (isCommentsPending) {
    return (
      <div className="flex justify-center py-4 text-gray-600 dark:text-gray-400">
        Loading...
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <section className="max-w-4xl mx-auto px-4" aria-label="댓글 섹션">
      <div className="w-full lg:w-3/4 mx-auto space-y-6">
        <CommentForm
          commentText={commentText}
          onCommentChange={(e) => setCommentText(e.target.value)}
          onSubmit={handleAddComment}
          isPending={commentMutations?.addCommentMutation.isPending}
        />

        <div className="space-y-4" role="feed" aria-label="댓글 목록">
          {data.comments.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              첫 댓글을 작성해보세요!
            </p>
          ) : (
            data.comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onDelete={() => handleDeleteComment(comment.id)}
                isDeletePending={commentMutations?.isPending}
                canModify={loggedInUser?.username === comment.author.username}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Comments;
