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
