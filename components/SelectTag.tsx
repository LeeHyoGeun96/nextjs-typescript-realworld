"use client";

import { useRouter } from "next/navigation";
import { MdClose } from "react-icons/md";

interface SelectTagProps {
  tags: string[];
  selectedTag?: string;
}

const SelectTag = ({ tags, selectedTag }: SelectTagProps) => {
  const router = useRouter();

  if (tags.length === 0) {
    return null;
  }

  const handleTagClick = (tag: string) => {
    const current = new URLSearchParams();
    current.set("tag", tag);
    router.push(`?${current.toString()}`);
  };

  const handleDeleteTag = () => {
    if (!selectedTag) return;
    const current = new URLSearchParams();
    current.delete("tag");
    router.push(`?${current.toString()}`);
  };

  return (
    <>
      {/* 모바일 버전 */}
      <nav className="lg:hidden ">
        <ul className=" flex gap-2 overflow-x-auto no-scrollbar touch-scroll pb-2">
          {tags.map((tag) => (
            <li key={tag}>
              <button
                type="button"
                className={`
                  inline-block px-3 py-1 text-sm 
                  rounded-full transition-colors
                  whitespace-nowrap
                  ${
                    selectedTag === tag
                      ? "bg-green-500 text-white"
                      : "text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }
                `}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              className="inline-block px-2 py-1 text-sm
                rounded-full  border-red-500 bg-red-500 text-white hover:bg-red-400 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900/20 focus:ring-red-500 dark:focus:ring-red-400"
              onClick={handleDeleteTag}
            >
              <MdClose className="w-4 h-4" />
            </button>
          </li>
        </ul>
      </nav>

      {/* 데스크톱 버전 */}
      <aside className="hidden lg:block bg-gray-100 dark:bg-gray-800 p-4 rounded-lg lg:w-[180px]">
        <section>
          <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Popular Tags
          </h2>

          <nav>
            <ul className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li key={tag}>
                  <button
                    type="button"
                    className={`
                      inline-block px-2 py-1 text-sm
                rounded-full transition-colors
                whitespace-nowrap
                      ${
                        selectedTag === tag
                          ? "bg-green-500 text-white"
                          : "text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }
                    `}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </button>
                </li>
              ))}
              <button
                type="button"
                className="inline-block px-2 py-1 text-sm
                rounded-full  border-red-500 bg-red-500 text-white hover:bg-red-400 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-900/20 focus:ring-red-500 dark:focus:ring-red-400"
                onClick={handleDeleteTag}
              >
                <MdClose className="w-4 h-4" />
              </button>
            </ul>
          </nav>
        </section>
      </aside>
    </>
  );
};

export default SelectTag;
