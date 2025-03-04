"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { RxDoubleArrowLeft, RxDoubleArrowRight } from "react-icons/rx";

interface PaginationProps {
  total: number;
  limit: number;
}

export function Pagination({ total, limit }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams?.get("page")) || 1;
  const totalPages = Math.ceil(total / limit);
  const [pageInput, setPageInput] = useState("");

  if (total === 0) return null;

  const getPageNumbers = () => {
    let pages = [];
    const maxVisible = 5; // 최대 보여줄 페이지 수

    if (totalPages <= maxVisible) {
      // 전체 페이지가 5개 이하면 모두 표시
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // 현재 페이지 기준으로 좌우 2개씩 표시
      let start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisible - 1);

      // 끝부분에서는 시작점 조정
      if (end === totalPages) {
        start = Math.max(1, end - maxVisible + 1);
      }

      pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value.replace(/[^0-9]/g, ""));
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = Number(pageInput);
    if (page >= 1 && page <= totalPages) {
      handlePageChange(page);
      setPageInput("");
    } else {
      setPageInput("");
    }
  };

  return (
    <nav className="flex items-center justify-center  py-8">
      <div className="flex items-center justify-center gap-2  relative">
        {/* 맨 처음으로 */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="px-2 py-1 rounded disabled:opacity-50"
          title="첫 페이지"
        >
          <RxDoubleArrowLeft className="text-black dark:text-white " />
        </button>

        {/* 이전 페이지 */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-1 rounded disabled:opacity-50"
          title="이전 페이지"
        >
          <MdArrowBackIos className="text-black dark:text-white " />
        </button>

        {/* 페이지 번호 버튼들 */}
        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`px-4 py-2 rounded ${
              pageNum === currentPage
                ? "bg-brand-primary text-white"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 dark:text-white"
            }`}
          >
            {pageNum}
          </button>
        ))}

        {/* 다음 페이지 */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 rounded disabled:opacity-50"
          title="다음 페이지"
        >
          <MdArrowForwardIos className="text-black dark:text-white  " />
        </button>

        {/* 맨 끝으로 */}
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 rounded disabled:opacity-50"
          title="마지막 페이지"
        >
          <RxDoubleArrowRight className="text-black dark:text-white " />
        </button>
        <section className="absolute left-full whitespace-nowrap">
          {/* 페이지 직접 입력 */}
          <form
            onSubmit={handlePageInputSubmit}
            className="flex items-center gap-2 ml-4"
          >
            <input
              type="text"
              value={pageInput}
              onChange={handlePageInputChange}
              placeholder="페이지"
              className="w-16 px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
              aria-label="페이지 번호 입력"
            />
            <div>
              <span className="text-gray-500 dark:text-white">
                / {totalPages}
              </span>
            </div>
            <button
              type="submit"
              className="px-3 py-1 text-sm bg-brand-primary text-white rounded hover:bg-brand-primary-dark"
            >
              이동
            </button>
          </form>
        </section>
      </div>
    </nav>
  );
}
