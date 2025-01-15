import { Link, useSearchParams } from "react-router-dom";

interface FeedToggleProps {
  params: {
    tab: string | undefined;
    tag: string | undefined;
  };
  isLoggedIn: boolean;
  onTabChange: (tab: "global" | "personal") => void;
  disabled?: boolean;
}

const FeedToggle = ({ params, isLoggedIn, onTabChange }: FeedToggleProps) => {
  const [searchParams] = useSearchParams();

  const handleStateChange = (e: any) => {
    const tab = new URLSearchParams(e.currentTarget.getAttribute("to")).get(
      "tab"
    ) as "global" | "personal";
    if (tab) onTabChange(tab);
  };

  const baseTabStyle = "inline-block px-4 py-2 transition-colors duration-200";
  const activeTabStyle =
    "text-brand-primary border-b-2 border-brand-primary font-medium dark:text-brand-primary";
  const inactiveTabStyle =
    "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300";

  return (
    <nav>
      <ul className="flex flex-wrap gap-x-1">
        {isLoggedIn && (
          <li>
            <Link
              to="?tab=personal"
              state={{ from: searchParams.toString() }}
              onClick={handleStateChange}
              className={`${baseTabStyle} ${
                params.tab === "personal" ? activeTabStyle : inactiveTabStyle
              }`}
            >
              Your Feed
            </Link>
          </li>
        )}
        <li>
          <Link
            to="?tab=global"
            state={{ from: searchParams.toString() }}
            onClick={handleStateChange}
            className={`${baseTabStyle} ${
              params.tab === "global" && !params.tag
                ? activeTabStyle
                : inactiveTabStyle
            }`}
          >
            Global Feed
          </Link>
        </li>
        {params.tag && (
          <li>
            <span className={`${baseTabStyle} ${activeTabStyle}`}>
              #{params.tag}
            </span>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default FeedToggle;
