import { Button } from "../ui/Button/Button";

interface CommentFormProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  disabled?: boolean;
}

export function CommentForm({
  value,
  onChange,
  onSubmit,
  disabled = false,
}: CommentFormProps) {
  return (
    <form
      className="card p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
      onSubmit={onSubmit}
    >
      <div className="mb-4">
        <textarea
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
          placeholder="댓글을 작성해주세요..."
          value={value}
          onChange={onChange}
          rows={3}
        />
      </div>
      <div className="flex justify-end">
        <Button
          variant="primary"
          disabled={value.trim().length === 0 || disabled}
          type="submit"
        >
          댓글 작성
        </Button>
      </div>
    </form>
  );
}
