import { Metadata } from "next";

export const metadata: Metadata = {
  title: "수정하기",
  description: "글을 수정할 수 있는 페이지입니다.",
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
