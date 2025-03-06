"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("페이지 에러 발생:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800 animate-fade-in">
        {/* 에러 아이콘 */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-12 h-12 text-red-500 dark:text-red-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* 에러 제목과 메시지 */}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          무언가 잘못되었습니다
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-6 break-words max-h-32 overflow-auto p-2 bg-gray-50 dark:bg-gray-700 rounded">
          {error.message || "알 수 없는 오류가 발생했습니다."}
        </p>

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            다시 시도하기
          </button>

          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>

      {/* 도움말 메시지 */}
      <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        문제가 계속되면 관리자에게 문의하세요.
      </p>
    </div>
  );
}
