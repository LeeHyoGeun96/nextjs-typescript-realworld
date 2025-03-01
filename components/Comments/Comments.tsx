// components/Comments/Comments.tsx
export function Comments({ children }: { children: React.ReactNode }) {
  return (
    <section className="max-w-4xl mx-auto px-4 mt-8" aria-label="댓글 섹션">
      <div className="w-full lg:w-3/4 mx-auto space-y-6 ">{children}</div>
    </section>
  );
}
