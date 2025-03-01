// components/Comments/CommentList.tsx
export function CommentList({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4" role="feed" aria-label="댓글 목록">
      {children}
    </div>
  );
}
