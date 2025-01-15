import { useQuery } from "@tanstack/react-query";
import { articleQueryOptions } from "../queryOptions/articleQueryOptions";
import { useUserStore } from "../store/userStore";
import NetworkError from "../errors/NetworkError";
import SelectTag from "./SelectTag";
import { tagQueryOptions } from "../queryOptions/tagQueryOptions";
import ArticleList from "./ArticleList";
import FeedToggle from "./FeedToggle";
import { ArticlesResponse } from "../types/articleTypes";
import { usePaginationParams } from "../hooks/usePaginationParams";
import { useArticlesFavoriteMutations } from "../hooks/useArticlesFavoriteMutations";
import { QUERY_KEYS } from "../queryOptions/constants/queryKeys";
import LoadingIndicator from "./LoadingIndicator";
import { useLoginConfirm } from "../hooks/useLoginConfirm";
import Pagination from "./Pagination";

const ITEMS_PER_PAGE = 10;

const PagenatedAticles = () => {
  const { isLoggedIn, token } = useUserStore();
  const { currentState, setOffset, setFilter } =
    usePaginationParams(ITEMS_PER_PAGE);
  const confirmLogin = useLoginConfirm();

  const getFeedQueryOption =
    currentState.tab === "personal" && token
      ? articleQueryOptions.getFeed({
          ...currentState,
          token: token,
        })
      : articleQueryOptions.getArticles({
          ...currentState,
          token: token ?? undefined,
        });

  const getTagsQueryOption = tagQueryOptions.getTags({
    token: token ?? undefined,
  });

  const articlesQuery = useQuery<ArticlesResponse, NetworkError>(
    getFeedQueryOption
  );

  const favoriteMutations = token
    ? useArticlesFavoriteMutations({
        queryKey:
          currentState.tab === "personal" && token
            ? QUERY_KEYS.articles.feed({
                ...currentState,
                token,
              })
            : QUERY_KEYS.articles.all({
                ...currentState,
                token,
              }),
        token,
      })
    : null;

  const handleFavoriteArticle = (slug: string) => {
    if (!favoriteMutations) {
      confirmLogin();
      return;
    }
    favoriteMutations.favoriteArticle.mutate(slug);
  };

  const handleUnfavoriteArticle = (slug: string) => {
    if (!favoriteMutations) {
      confirmLogin();
      return;
    }
    favoriteMutations.unfavoriteArticle.mutate(slug);
  };

  const { articles, articlesCount } = articlesQuery.data || {
    articles: [],
    articlesCount: 0,
  };

  const tagsQuery = useQuery(getTagsQueryOption);
  const tags = tagsQuery.data?.tags || [];

  if (articlesQuery.isLoading) {
    return (
      <div className="p-4 text-center text-gray-600 dark:text-gray-400">
        Loading...
      </div>
    );
  }

  if (articlesQuery.isError || tagsQuery.isError) {
    throw articlesQuery.error || tagsQuery.error;
  }

  const isFetching = articlesQuery.isFetching;

  const pageCount = Math.ceil(articlesCount / ITEMS_PER_PAGE);
  const currentPage = Math.floor(currentState.offset / ITEMS_PER_PAGE);

  const handlePageClick = (event: { selected: number }) => {
    setOffset(event.selected);
  };

  const handleTagClick = (tag: string) => {
    setFilter({
      ...currentState,
      tag,
    });
  };

  const handleTabChange = (tab: "global" | "personal") => {
    setFilter({
      ...currentState,
      tab,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 태그 사이드바를 위한 더미 div */}
        <div className="hidden lg:block lg:w-64"></div>

        <div className="lg:hidden overflow-x-auto -mx-4 px-4">
          <div className="flex space-x-2 whitespace-nowrap">
            <SelectTag tags={tags} onTagClick={handleTagClick} />
          </div>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 max-w-3xl mx-auto w-full">
          <FeedToggle
            params={{ tab: currentState.tab, tag: currentState.tag }}
            isLoggedIn={isLoggedIn}
            onTabChange={handleTabChange}
            disabled={isFetching}
          />

          <ArticleList
            articles={articles}
            favoriteArticle={handleFavoriteArticle}
            unfavoriteArticle={handleUnfavoriteArticle}
            isPending={favoriteMutations?.isPending || false}
          />

          <LoadingIndicator isFetching={isFetching} />

          <div className="mt-8">
            <Pagination
              pageCount={pageCount}
              currentPage={currentPage}
              onPageChange={handlePageClick}
            />
          </div>
        </div>

        {/* 태그 사이드바 */}
        <div className="hidden lg:block lg:w-64">
          <div className="lg:sticky lg:top-24">
            <SelectTag tags={tags} onTagClick={handleTagClick} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagenatedAticles;
