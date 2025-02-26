import TagList from "./TagList";

interface SelectTagProps {
  tags: string[];
  selectedTag?: string;
}

const SelectTag = ({ tags, selectedTag }: SelectTagProps) => {
  if (tags.length === 0) {
    return null;
  }

  return (
    <>
      {/* 모바일 버전 */}
      <nav className="lg:hidden">
        <TagList
          tags={tags}
          selectedTag={selectedTag}
          className="overflow-x-auto no-scrollbar touch-scroll pb-2"
        />
      </nav>

      {/* 데스크톱 버전 */}
      <aside className="hidden lg:block bg-gray-100 dark:bg-gray-800 p-4 rounded-lg lg:w-[180px]">
        <section>
          <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Popular Tags
          </h2>

          <nav>
            <TagList tags={tags} selectedTag={selectedTag} />
          </nav>
        </section>
      </aside>
    </>
  );
};

export default SelectTag;
