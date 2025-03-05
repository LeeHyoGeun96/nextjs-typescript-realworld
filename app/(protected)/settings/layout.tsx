import { AvatarProvider } from "@/context/avatar/AvatarContext";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <AvatarProvider>
        <main className="flex justify-center">
          <section className="bg-white dark:bg-gray-800 rounded-lg p-6 md:p-8 max-w-4xl w-full">
            {children}
          </section>
        </main>
      </AvatarProvider>
    </>
  );
}
