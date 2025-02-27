// import { QueryClient, useSuspenseQuery } from "@tanstack/react-query";
// import { useUserStore } from "../store/userStore";
// import NetworkError from "../errors/NetworkError";
// import { articleQueryOptions } from "../queryOptions/articleQueryOptions";
// import {
//   Form,
//   Link,
//   LoaderFunctionArgs,
//   useLoaderData,
// } from "react-router-dom";
// import { checkSameUser } from "../util/checkSameUser";
// import TagList from "../components/TagList";
// import Comments from "../components/Comments";
// import { QUERY_KEYS } from "../queryOptions/constants/queryKeys";
// import useFollowMutations from "../hooks/useFollowMutations";
// import { profileQueryOptions } from "../queryOptions/profileQueryOptions";
// import { useArticleFavoriteMutations } from "../hooks/useArticleFavoriteMutations";
// import Avatar from "../components/Avatar";
// import { useLoginConfirm } from "../hooks/useLoginConfirm";

import ArticleContent from "@/components/Article/ArticleContent";
import ArticlesSWRProvider from "@/lib/swr/ArticleSWRProvider";
import { Params } from "@/types/global";
import { optionalAuthHeaders } from "@/utils/auth/optionalAuthHeaders";
import { cookies } from "next/headers";

// export const loader =
//   (queryClient: QueryClient) =>
//   async ({ params }: LoaderFunctionArgs) => {
//     const { slug } = params;
//     const { token } = useUserStore.getState();
//     let articleResponse = null;
//     if (!slug) {
//       return new NetworkError({ code: 400, message: "slug가 필요합니다." });
//     }

//     try {
//       if (token) {
//         articleResponse = await queryClient.ensureQueryData(
//           articleQueryOptions.getArticle({ slug, token })
//         );
//         await queryClient.ensureQueryData(
//           profileQueryOptions.getProfile({
//             username: articleResponse.article.author.username,
//             token,
//           })
//         );
//       } else {
//         await queryClient.ensureQueryData(
//           articleQueryOptions.getArticle({ slug })
//         );
//       }

//       return { token, slug };
//     } catch (error) {
//       if (NetworkError.isNetworkError(error)) {
//         return error;
//       }
//       throw error;
//     }
//   };

// const ArticlePage = () => {
//   const loaderData = useLoaderData() as {
//     token: string | null;
//     slug: string;
//   };

//   const articleQuery = useSuspenseQuery(
//     articleQueryOptions.getArticle({
//       slug: loaderData.slug,
//       token: loaderData.token ?? undefined,
//     })
//   );

//   const { user: loggedInUser } = useUserStore();

//   const { article } = articleQuery.data;

//   const profileQuery = useSuspenseQuery({
//     ...profileQueryOptions.getProfile({
//       username: article.author.username,
//       token: loaderData.token ?? undefined,
//     }),
//   });
//   const confirmLogin = useLoginConfirm();

//   const { data: profileData } = profileQuery;

//   const followMutations = loaderData.token
//     ? useFollowMutations({
//         queryKey: QUERY_KEYS.profile.getProfile({
//           username: article.author.username,
//           token: loaderData.token,
//         }),
//         token: loaderData.token,
//         username: article.author.username,
//       })
//     : null;

//   const favoriteMutations = loaderData.token
//     ? useArticleFavoriteMutations({
//         queryKey: QUERY_KEYS.article.detail(article.slug, loaderData.token),
//         token: loaderData.token,
//         slug: article.slug,
//       })
//     : null;

//   const handleFollow = () => {
//     if (!followMutations) {
//       confirmLogin();
//       return;
//     }
//     followMutations.followMutation.mutate();
//   };

//   const handleUnfollow = () => {
//     if (!followMutations) {
//       confirmLogin();
//       return;
//     }
//     followMutations.unfollowMutation.mutate();
//   };

//   const handleFavorite = () => {
//     if (!favoriteMutations) {
//       confirmLogin();
//       return;
//     }
//     favoriteMutations.favoriteArticle.mutate();
//   };

//   const handleUnfavorite = () => {
//     if (!favoriteMutations) {
//       confirmLogin();
//       return;
//     }
//     favoriteMutations.unfavoriteArticle.mutate();
//   };

//   let isSameUser = false;

//   if (loggedInUser) {
//     isSameUser = checkSameUser({
//       loggedInUser: loggedInUser,
//       responseUser: article,
//     });
//   }

//   return (
//     <article className="article-page">
//       <header className="bg-gray-700 dark:bg-gray-800 shadow-sm py-8">
//         <div className="container mx-auto px-4 py-8">
//           <h1 className="text-3xl font-semibold text-white">{article.title}</h1>

//           <div className="flex flex-wrap items-center  gap-4 mt-4 ">
//             <section className="flex items-center">
//               <Link
//                 to={`/profile/${article.author.username}`}
//                 aria-label={`${article.author.username}의 프로필로 이동`}
//               >
//                 <Avatar
//                   username={article.author.username}
//                   image={article.author.image}
//                   size="md"
//                   className="mr-2"
//                 />
//               </Link>
//               <div className="mr-6">
//                 <Link
//                   to={`/profile/${article.author.username}`}
//                   className="text-brand-primary hover:text-brand-primary/90 font-medium"
//                 >
//                   {article.author.username}
//                 </Link>
//                 <time
//                   className="text-gray-500 text-sm block"
//                   dateTime={article.createdAt.toString()}
//                 >
//                   {new Date(article.createdAt).toLocaleDateString()}
//                 </time>
//               </div>
//             </section>

//             <nav
//               className="flex items-center flex-wrap gap-4"
//               aria-label="글 관련 작업"
//             >
//               <button
//                 className={
//                   "btn btn-sm border border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
//                 }
//                 onClick={article.favorited ? handleUnfavorite : handleFavorite}
//                 disabled={favoriteMutations?.isPending || false}
//                 aria-pressed={article.favorited}
//               >
//                 <span className="inline-flex items-center">
//                   <i
//                     className="ion-heart mr-[2px] self-center translate-y-[1px]"
//                     aria-hidden="true"
//                   ></i>
//                   <span>
//                     {article.favorited ? "Unfavorite" : "Favorite"} Post{" "}
//                     <span className="counter">({article.favoritesCount})</span>
//                   </span>
//                 </span>
//               </button>
//               {!isSameUser && (
//                 <button
//                   className="btn btn-sm border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
//                   disabled={followMutations?.isPending || false}
//                   onClick={
//                     profileData?.profile.following
//                       ? handleUnfollow
//                       : handleFollow
//                   }
//                   aria-pressed={profileData?.profile.following}
//                 >
//                   <i className="ion-plus-round mr-[1px]" aria-hidden="true"></i>
//                   <span>
//                     {profileData?.profile.following ? "Unfollow" : "Follow"}{" "}
//                     {article.author.username}
//                   </span>
//                 </button>
//               )}
//               {isSameUser && (
//                 <>
//                   <Link
//                     to={`/editor/${article.slug}`}
//                     className="btn btn-sm border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
//                     aria-label="글 수정하기"
//                   >
//                     <i className="ion-edit" aria-hidden="true"></i> Edit Article
//                   </Link>
//                   <Form
//                     method="post"
//                     action={`/deleteArticle/${article.slug}`}
//                     className="inline-block"
//                   >
//                     <button
//                       className="btn btn-sm border border-red-700 text-red-700 hover:bg-red-700 hover:text-white"
//                       type="submit"
//                       aria-label="글 삭제하기"
//                     >
//                       <i className="ion-trash-a" aria-hidden="true"></i> Delete
//                       Article
//                     </button>
//                   </Form>
//                 </>
//               )}
//             </nav>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 py-8">
//         <section className="prose dark:prose-invert max-w-none">
//           <div className="mb-8">
//             <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
//               {article.body}
//             </p>
//           </div>

//           <div className="mt-4">
//             <TagList tags={article.tagList} />
//           </div>
//         </section>

//         <hr className="my-8 border-gray-200 dark:border-gray-700" />

//         <section aria-label="댓글">
//           <Comments slug={article.slug} />
//         </section>
//       </main>
//     </article>
//   );
// };

// export default ArticlePage;

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const headers = optionalAuthHeaders(token);

  const articleResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/articles/${slug}`,
    {
      headers,
    }
  ).then((res) => res.json());

  const article = articleResponse.article;

  const [profile, comments] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/profiles/${article.author.username}`,
      {
        headers,
      }
    ).then((res) => res.json()),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${slug}/comments`, {
      headers,
    }).then((res) => res.json()),
  ]);

  const profileKey = `/api/profiles/${article.author.username}`;
  const commentsKey = `/api/articles/${slug}/comments`;
  const articleKey = `/api/articles/${slug}`;

  const keys = {
    profile: profileKey,
    comments: commentsKey,
    article: articleKey,
  };

  return (
    <ArticlesSWRProvider
      fallback={{
        [keys.profile]: profile,
        [keys.comments]: comments,
        [keys.article]: articleResponse,
      }}
    >
      <ArticleContent keys={keys} isLoggedIn={!!token} />
    </ArticlesSWRProvider>
  );
}
