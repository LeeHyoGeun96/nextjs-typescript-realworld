import { ProfileType } from "@/types/profileTypes";
import Avatar from "../ui/Avata/Avatar";
import ProfileActions from "./ProfileActions";

interface ProfileHeaderProps {
  profile: ProfileType;
  apiKeys: {
    profileKey: string;
  };
  initialData: Record<string, unknown>;
}

export default function ProfileHeader({
  profile,
  apiKeys,
  initialData,
}: ProfileHeaderProps) {
  return (
    <header className="bg-gray-100 dark:bg-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <Avatar user={profile} size="xxxxl" className="mb-4" />
          <h2 className="text-2xl font-bold mb-2">{profile.username}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-center max-w-2xl">
            {profile.bio || "No bio available"}
          </p>

          <ProfileActions apiKeys={apiKeys} initialData={initialData} />
        </div>
      </div>
    </header>
  );
}
