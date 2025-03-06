"use client";

import { useRouter } from "@bprogress/next/app";

interface FeedToggleProps {
  params: {
    tab: string | undefined;
    tag: string | undefined;
  };
  isLoggedIn: boolean;

  disabled?: boolean;
}

const FeedToggle = ({ params, isLoggedIn }: FeedToggleProps) => {
  const router = useRouter();

  const currentTab = params?.tab ?? "global";
  const currentTag = params?.tag ?? "";

  const handleStateChange = (tab: "global" | "personal") => {
    const current = new URLSearchParams();
    current.set("tab", tab);
    router.push(`?${current.toString()}`, { showProgress: true });
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
            <button
              onClick={() => handleStateChange("personal")}
              className={`${baseTabStyle} ${
                currentTab === "personal" ? activeTabStyle : inactiveTabStyle
              }`}
            >
              Your Feed
            </button>
          </li>
        )}
        <li>
          <button
            onClick={() => handleStateChange("global")}
            className={`${baseTabStyle} ${
              currentTab === "global" && !currentTag
                ? activeTabStyle
                : inactiveTabStyle
            }`}
          >
            Global Feed
          </button>
        </li>
        {currentTag && (
          <li>
            <span className={`${baseTabStyle} ${activeTabStyle}`}>
              #{currentTag}
            </span>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default FeedToggle;
