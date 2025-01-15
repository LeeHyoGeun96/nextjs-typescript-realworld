interface SelectTagProps {
  tags: string[];
  onTagClick: (tag: string) => void;
  selectedTag?: string;
}

const SelectTag = ({ tags, onTagClick, selectedTag }: SelectTagProps) => {
  if (tags.length === 0) {
    return null;
  }

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
                onClick={() => onTagClick(tag)}
              >
                {tag}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* 데스크톱 버전 */}
      <aside className="hidden lg:block bg-gray-100 dark:bg-gray-800 p-4 rounded-lg lg:w-[180px]">
        <section>
          <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Popular Tags
          </h2>

          <nav>
            <ul className="grid grid-cols-2 gap-2">
              {tags.map((tag) => (
                <li key={tag}>
                  <button
                    type="button"
                    className={`
                      inline-block px-2 py-1 text-sm
                      rounded-full transition-colors
                      ${
                        selectedTag === tag
                          ? "bg-green-500 text-white"
                          : "text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }
                    `}
                    onClick={() => onTagClick(tag)}
                  >
                    {tag}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </section>
      </aside>
    </>
  );
};

export default SelectTag;
