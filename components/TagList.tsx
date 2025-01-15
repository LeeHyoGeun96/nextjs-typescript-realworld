interface TagListProps {
  tags: string[];
  onRemoveTag?: (tag: string) => void;
}

const TagList = ({ tags, onRemoveTag }: TagListProps) => {
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm 
                     bg-gray-200 text-gray-700 hover:bg-gray-300 
                     dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 
                     transition-colors duration-200"
        >
          {onRemoveTag && (
            <button
              onClick={() => onRemoveTag(tag)}
              className="mr-1 hover:text-red-500 focus:outline-none"
              aria-label={`Remove ${tag} tag`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
          <span>{tag}</span>
        </li>
      ))}
    </ul>
  );
};

export default TagList;
