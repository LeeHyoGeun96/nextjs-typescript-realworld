import Link from "next/link";
import { ArticleType } from "../../types/articleTypes";
import Avatar from "../ui/Avata/Avatar";

interface ArticleListProps {
  articles: ArticleType[];
  // favoriteArticle: (slug: string) => void;
  // unfavoriteArticle: (slug: string) => void;
  // isPending: boolean;
}

const ArticleList = ({
  articles,
}: // favoriteArticle,
// unfavoriteArticle,
// isPending,
ArticleListProps) => {
  if (articles.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">데이터가 없습니다.</div>
    );
  }

  return (
    <section className="divide-y divide-gray-200 dark:divide-gray-700">
      {articles.map((article) => (
        <article key={article.slug} className="py-6">
          <header className="flex items-center mb-4">
            <Link
              href={`/profile/${article.author.username}`}
              className=" flex-shrink-0"
            >
              <Avatar
                username={article.author.username || ""}
                image={article.author.image}
                size="md"
                className="mr-1"
              />
            </Link>
            <div className="flex flex-col ml-3 flex-grow">
              <Link
                href={`/profile/${article.author.username}`}
                className="text-brand-primary hover:text-brand-secondary font-medium"
              >
                {article.author.username}
              </Link>
              <time className="text-gray-500 dark:text-gray-400 text-sm">
                {new Date(article.createdAt).toLocaleDateString()}
              </time>
            </div>
            <button
              className={`ml-4 px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors
                ${
                  article.favorited
                    ? "bg-brand-primary text-white hover:bg-brand-secondary"
                    : "border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
                }`}
              type="button"
              // disabled={isPending}
              // onClick={() =>
              //   article.favorited
              //     ? unfavoriteArticle(article.slug)
              //     : favoriteArticle(article.slug)
              // }
            >
              <i className="ion-heart" aria-hidden="true"></i>
              <span>{article.favoritesCount}</span>
            </button>
          </header>
          <Link href={`/article/${article.slug}`} className="block group ">
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-brand-primary">
              {article.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {article.description}
            </p>
            <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap">
              <span className="text-brand-primary text-sm mb-2 sm:mb-0">
                Read more...
              </span>
              <ul className="flex flex-wrap gap-2" aria-label="태그 목록">
                {article.tagList.map((tag) => (
                  <li
                    key={tag}
                    className="px-2 py-1 text-xs rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </footer>
          </Link>
        </article>
      ))}
    </section>
  );
};

export default ArticleList;
