import ReactPaginate from "react-paginate";

interface PaginationProps {
  pageCount: number;
  currentPage: number;
  onPageChange: (selectedItem: { selected: number }) => void;
  className?: string;
  pageRangeDisplayed?: number; // 현재 페이지 주변에 보여질 페이지 수
  marginPagesDisplayed?: number; // 시작과 끝에 보여질 페이지 수
  showNavigateButtons?: boolean; // 이전/다음 버튼 표시 여부
}

const Pagination = ({
  pageCount,
  currentPage,
  onPageChange,
  className = "",
  pageRangeDisplayed = 5, // 기본값 3
  marginPagesDisplayed = 1, // 기본값 1
  showNavigateButtons = false,
}: PaginationProps) => {
  return (
    <ReactPaginate
      pageCount={pageCount}
      onPageChange={onPageChange}
      forcePage={currentPage}
      pageRangeDisplayed={pageRangeDisplayed} // 예: 1 ... 4 5 [6] 7 8 ... 10
      marginPagesDisplayed={marginPagesDisplayed} // 예: [1] ... 4 5 6 ... [10]
      containerClassName={`flex justify-center gap-2 ${className}`}
      pageClassName="rounded-md"
      pageLinkClassName="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors"
      activeClassName="!bg-brand-primary"
      activeLinkClassName="!text-white hover:!bg-brand-primary"
      previousLabel={showNavigateButtons ? "이전" : ""}
      nextLabel={showNavigateButtons ? "다음" : ""}
      previousClassName={showNavigateButtons ? "rounded-md" : "hidden"}
      nextClassName={showNavigateButtons ? "rounded-md" : "hidden"}
      breakLabel="..."
      breakClassName="text-gray-500 dark:text-gray-400 self-center"
      disabledClassName="opacity-50"
      disabledLinkClassName="cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-700"
    />
  );
};

export default Pagination;
