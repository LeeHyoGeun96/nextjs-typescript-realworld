import { ModalFooterProps } from "./types";

export function ModalFooter({ children, className = "" }: ModalFooterProps) {
  return (
    <div
      className={`
      px-6 py-4 border-t dark:border-gray-700
      bg-gray-50 dark:bg-gray-900
      flex justify-end items-center gap-2
      ${className}
    `}
    >
      {children}
    </div>
  );
}
