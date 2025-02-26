"use client";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="dark:bg-gray-900 min-h-screen flex justify-center">
      {children}
    </main>
  );
}
