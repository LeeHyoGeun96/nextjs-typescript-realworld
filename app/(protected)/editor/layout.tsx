import { Metadata } from "next";
export const metadata: Metadata = {
  title: "글쓰기",
  description: "글을 작성할 수 있는 페이지입니다.",
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-white dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">{children}</div>
      </div>
    </main>
  );
}
