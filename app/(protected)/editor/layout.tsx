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
    <div className="max-w-3xl mx-auto ">
      <div className=" pt-10">{children}</div>
    </div>
  );
}
