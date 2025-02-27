// components/Comments/CommentCard.tsx
import Link from "next/link";
import { CommentType } from "@/types/articleTypes";
import Avatar from "@/components/ui/Avata/Avatar";
import { FaRegTrashAlt } from "react-icons/fa";

interface CommentCardProps {
  comment: CommentType;
  onDelete?: () => void;
  canModify?: boolean;
}

export function CommentCard({
  comment,
  onDelete,
  canModify,
}: CommentCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line">
        {comment.body}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href={`/profile/${comment.author.username}`}>
            <Avatar
              username={comment.author.username}
              image={comment.author.image}
              size="sm"
              className="mr-2"
            />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href={`/profile/${comment.author.username}`}
              className="text-brand-primary font-medium"
            >
              {comment.author.username}
            </Link>
            <time
              className="text-gray-500 text-sm block"
              dateTime={comment.createdAt}
            >
              {new Date(comment.createdAt).toLocaleDateString("ko-KR")}
            </time>
          </div>
        </div>

        {canModify && (
          <button
            className="btn-outline-red"
            onClick={onDelete}
            aria-label="댓글 삭제"
          >
            <FaRegTrashAlt />
          </button>
        )}
      </div>
    </div>
  );
}
