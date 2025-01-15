import { Input } from "./Input";

interface CommentFormProps {
  commentText: string;
  onCommentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isPending?: boolean;
}

const CommentForm = ({
  commentText,
  onCommentChange,
  onSubmit,
  isPending,
}: CommentFormProps) => (
  <form className="card comment-form" onSubmit={onSubmit}>
    <div className="card-block mb-4">
      <Input
        className="form-control"
        placeholder="Write a comment..."
        value={commentText}
        onChange={onCommentChange}
        isTextArea
        rows={3}
      />
    </div>
    <div className="card-footer">
      <button
        className="btn btn-sm btn-primary"
        disabled={isPending || commentText.trim().length === 0}
        type="submit"
      >
        {isPending ? "Posting..." : "Post Comment"}
      </button>
    </div>
  </form>
);

export default CommentForm;
