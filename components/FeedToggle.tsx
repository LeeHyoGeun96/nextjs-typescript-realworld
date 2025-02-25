"use client";

import { useRouter } from "next/navigation";

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

  const tab = params?.tab ?? "global";
  const tag = params?.tag ?? "";

  const handleStateChange = (tab: "global" | "personal") => {
    const current = new URLSearchParams();
    current.set("tab", tab);
    router.push(`?${current.toString()}`);
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
                tab === "personal" ? activeTabStyle : inactiveTabStyle
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
              tab === "global" && !tag ? activeTabStyle : inactiveTabStyle
            }`}
          >
            Global Feed
          </button>
        </li>
        {tag && (
          <li>
            <span className={`${baseTabStyle} ${activeTabStyle}`}>#{tag}</span>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default FeedToggle;
