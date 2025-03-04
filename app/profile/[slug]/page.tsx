// import { useSuspenseQuery } from "@tanstack/react-query";
// import { Link, NavLink, useMatch, useParams } from "react-router-dom";
// import { profileQueryOptions } from "../queryOptions/profileQueryOptions";
// import { Store } from "../store/userStore";
// import NetworkError from "../errors/NetworkError";
// import { articleQueryOptions } from "../queryOptions/articleQueryOptions";
// import { usePaginationParams } from "../hooks/usePaginationParams";
// import ArticleList from "../components/ArticleList";
// import { useArticlesFavoriteMutations } from "../hooks/useArticlesFavoriteMutations";
// import { QUERY_KEYS } from "../queryOptions/constants/queryKeys";
// import useFollowMutations from "../hooks/useFollowMutations";
// import Avatar from "../components/Avatar";
// import { useLoginConfirm } from "../hooks/useLoginConfirm";
// import Pagination from "../components/Pagination";

// const ITEMS_PER_PAGE = 10;

// const ProfilePage = () => {
//   const { token, user: loggedInUser } = useUserStore();

//   const { username } = useParams();
//   const favoritesMatch = useMatch(`profile/${username}/favorites`);
//   const { currentState, setOffset } = usePaginationParams(ITEMS_PER_PAGE);
//   const confirmLogin = useLoginConfirm();

//   const { data: uesrData } = useSuspenseQuery({
//     ...profileQueryOptions.getProfile({
//       username: username!,
//       token: token ?? undefined,
//     }),
//   });

//   const articlesQuery = useSuspenseQuery({
//     ...articleQueryOptions.getArticles({
//       ...currentState,
//       token: token ?? undefined,
//       author: !!favoritesMatch ? undefined : username,
//       favorited: !!favoritesMatch ? username : undefined,
//     }),
//   });

//   const favoriteMutations = token
//     ? useArticlesFavoriteMutations({
//         queryKey: QUERY_KEYS.articles.all({
//           ...currentState,
//           token: token ?? undefined,
//           author: favoritesMatch ? undefined : username,
//           favorited: favoritesMatch ? username : undefined,
//         }),
//         token,
//       })
//     : null;

//   const followMutations =
//     token && username
//       ? useFollowMutations({
//           queryKey: QUERY_KEYS.profile.getProfile({
//             username,
//             token,
//           }),
//           token,
//           username,
//         })
//       : null;

//   const handleFavoriteArticle = (slug: string) => {
//     if (!favoriteMutations) {
//       confirmLogin();
//       return;
//     }
//     favoriteMutations.favoriteArticle.mutate(slug);
//   };

//   const handleUnfavoriteArticle = (slug: string) => {
//     if (!favoriteMutations) {
//       confirmLogin();
//       return;
//     }
//     favoriteMutations.unfavoriteArticle.mutate(slug);
//   };

//   const handleFollowUser = () => {
//     if (!followMutations) {
//       confirmLogin();
//       return;
//     }
//     followMutations.followMutation.mutate();
//   };

//   const handleUnfollowUser = () => {
//     if (!followMutations) {
//       confirmLogin();
//       return;
//     }
//     followMutations.unfollowMutation.mutate();
//   };

//   const handlePageClick = (event: { selected: number }) => {
//     setOffset(event.selected);
//   };

//   const { articles, articlesCount } = articlesQuery.data || {
//     articles: [],
//     articlesCount: 0,
//   };

//   const pageCount = Math.ceil(articlesCount / ITEMS_PER_PAGE);
//   const currentPage = Math.floor(currentState.offset / ITEMS_PER_PAGE);
//   const isSameUser = loggedInUser?.username === username;

//   if (!username || !token) {
//     throw new NetworkError({ code: 401, message: "Unauthorized" });
//   }

//   return (
//     <main className="bg-white dark:bg-gray-900 min-h-screen">
//       <header className="bg-gray-100 dark:bg-gray-800 py-8">
//         <div className="container mx-auto px-4 w-full">
//           <article className="max-w-3xl mx-auto flex flex-col items-center">
//             <Avatar
//               username={uesrData?.profile.username || ""}
//               image={uesrData?.profile.image}
//               size="lg"
//               className="mb-4"
//             />
//             <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
//               {uesrData?.profile.username ?? ""}
//             </h2>
//             <p className="text-gray-600 dark:text-gray-300 mb-4 text-center px-4 max-w-2xl">
//               {uesrData?.profile.bio ?? ""}
//             </p>
//             {isSameUser ? (
//               <Link
//                 to="/settings"
//                 className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
//                 aria-label="프로필 설정 편집"
//               >
//                 <i className="ion-gear-a mr-1" aria-hidden="true"></i>
//                 <span>Edit Profile Settings</span>
//               </Link>
//             ) : (
//               <button
//                 className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50"
//                 disabled={followMutations?.isPending}
//                 onClick={
//                   uesrData?.profile.following
//                     ? handleUnfollowUser
//                     : handleFollowUser
//                 }
//                 aria-pressed={uesrData?.profile.following}
//               >
//                 <i className="ion-plus-round mr-1" aria-hidden="true"></i>
//                 <span>
//                   {uesrData?.profile.following ? "Unfollow" : "Follow"}{" "}
//                   {uesrData?.profile.username}
//                 </span>
//               </button>
//             )}
//           </article>
//         </div>
//       </header>

//       <section
//         className="container mx-auto px-4 py-8 overflow-x-hidden"
//         aria-label="글 목록"
//       >
//         <div className="max-w-3xl mx-auto">
//           <nav
//             className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 mb-6"
//             aria-label="글 필터"
//           >
//             <NavLink
//               to={`/profile/${username}`}
//               className={({ isActive }) =>
//                 `px-4 py-2 text-sm sm:text-base md:text-lg font-medium whitespace-nowrap ${
//                   isActive
//                     ? "text-brand-primary border-b-2 border-brand-primary"
//                     : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
//                 }`
//               }
//               end
//               role="tab"
//               aria-selected={!favoritesMatch}
//             >
//               <span className="block">
//                 {isSameUser ? "My" : `${uesrData?.profile.username}'s`} Articles
//               </span>
//             </NavLink>
//             <NavLink
//               to={`/profile/${username}/favorites`}
//               className={({ isActive }) =>
//                 `px-4 py-2 text-sm sm:text-base md:text-lg font-medium whitespace-nowrap ${
//                   isActive
//                     ? "text-brand-primary border-b-2 border-brand-primary"
//                     : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
//                 }`
//               }
//               role="tab"
//               aria-selected={!!favoritesMatch}
//             >
//               <span className="block">
//                 {isSameUser ? "My" : `${uesrData?.profile.username}'s`}{" "}
//                 Favorited Articles
//               </span>
//             </NavLink>
//           </nav>

//           <div className="w-full overflow-x-auto">
//             <ArticleList
//               articles={articles}
//               favoriteArticle={handleFavoriteArticle}
//               unfavoriteArticle={handleUnfavoriteArticle}
//               isPending={articlesQuery.isFetching}
//             />
//             <Pagination
//               pageCount={pageCount}
//               currentPage={currentPage}
//               onPageChange={handlePageClick}
//               className="flex-wrap"
//             />
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// };

// export default ProfilePage;

import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { Params, SearchParams } from "@/types/global";
import { parseQueryParams } from "@/utils/parseQueryParams";
import { optionalAuthHeaders } from "@/utils/auth/optionalAuthHeaders";
import { cookies, headers } from "next/headers";
import { Pagination } from "@/components/ui/Pagination";
import { ProfileResponse } from "@/types/profileTypes";
import { ArticlesResponse } from "@/types/articleTypes";

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
    <div className="profile-page">
      {/* 프로필 헤더 - 서버 컴포넌트 */}
      <ProfileHeader
        profile={profileData}
        apiKeys={apiKeys}
        initialData={fallback}
      />

      {/* 탭 UI - 클라이언트 컴포넌트 */}

      <ProfileTabs
        username={username}
        apiKeys={apiKeys}
        initialData={fallback}
        isFavoritesTab={isFavorites}
      />

      <Pagination total={articlesCount} limit={PAGE_LIMIT} />
    </div>
  );
}
