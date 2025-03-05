import { ModalHeaderProps } from "./types";

export function ModalHeader({
  children,
  showClose = true,
  className = "",
  onClose,
}: ModalHeaderProps) {
  return (
    <div
      className={`
      px-6 py-4 border-b dark:border-gray-700
      flex items-center justify-between
      ${className}
    `}
    >
      <div className="font-semibold text-lg">{children}</div>

      {showClose && (
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700
                     dark:text-gray-400 dark:hover:text-gray-200
                     transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
