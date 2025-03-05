import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { Params, SearchParams } from "@/types/global";
import { parseQueryParams } from "@/utils/parseQueryParams";
import { optionalAuthHeaders } from "@/utils/auth/optionalAuthHeaders";
import { cookies, headers } from "next/headers";
import { Pagination } from "@/components/ui/Pagination";
import { ProfileResponse } from "@/types/profileTypes";
import { ArticlesResponse } from "@/types/articleTypes";
import SWRProvider from "@/lib/swr/SWRProvider";

const PAGE_LIMIT = 5;

export default async function ProfilePage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug: username } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const header = optionalAuthHeaders(token);

  // 현재 URL 가져오기
  const headersList = await headers();
  const url = headersList.get("x-pathname") || "";

  // URL에 'favorite'이 포함되어 있는지 확인
  const isFavorites = url.includes("/favorite");

  // 탭에 따라 API 쿼리 파라미터 조정
  const addParams = isFavorites
    ? { favorited: username }
    : { author: username };

  const { apiQueryString } = await parseQueryParams({
    searchParams,
    addParams,
    limit: PAGE_LIMIT,
  });

  const profileKey = `/api/profiles/${username}`;
  const articlesKey = `/api/articles?${apiQueryString}`;

  const apiKeys = {
    profileKey,
    articlesKey,
  } as const;

  const [profileResponse, articlesResponse] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiKeys.profileKey}`, {
      headers: header,
    }).then((res) => res.json() as Promise<ProfileResponse>),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}${apiKeys.articlesKey}`, {
      headers: header,
    }).then((res) => res.json() as Promise<ArticlesResponse>),
  ]);

  const profileData = profileResponse.profile;
  const articlesCount = articlesResponse.articlesCount;

  const fallback = {
    [apiKeys.profileKey]: profileResponse,
    [apiKeys.articlesKey]: articlesResponse,
  };

  return (
    <SWRProvider fallback={fallback}>
      <div className="profile-page">
        {/* 프로필 헤더 - 서버 컴포넌트 */}
        <ProfileHeader profile={profileData} apiKeys={apiKeys} />

        {/* 탭 UI - 클라이언트 컴포넌트 */}

        <ProfileTabs
          username={username}
          apiKeys={apiKeys}
          isFavoritesTab={isFavorites}
        />

        <Pagination total={articlesCount} limit={PAGE_LIMIT} />
      </div>
    </SWRProvider>
  );
}
