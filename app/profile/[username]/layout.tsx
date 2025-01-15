export default function ProfileLayout({
  children,
  favorites,
}: {
  children: React.ReactNode;
  favorites: React.ReactNode;
}) {
  return (
    <div className="profile-layout">
      <div className="main-content">{children}</div>
      <div className="favorites-content">
        {favorites} {/* favorites로 통일 */}
      </div>
    </div>
  );
}
