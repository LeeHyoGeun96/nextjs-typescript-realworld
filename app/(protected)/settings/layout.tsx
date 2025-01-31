import { AvatarProvider } from "@/context/avatar/AvatarContext";

export default function SettingsLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <AvatarProvider>
        {children}
        <div className="w-full">{modal}</div>
      </AvatarProvider>
    </>
  );
}
