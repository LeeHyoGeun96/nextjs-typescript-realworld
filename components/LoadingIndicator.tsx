interface LoadingIndicatorProps {
  isLoading?: boolean;
  isFetching?: boolean;
  className?: string;
}

const LoadingIndicator = ({
  isLoading,
  isFetching,
  className = "",
}: LoadingIndicatorProps) => {
  // 완전히 빈 상태에서의 로딩
  if (isLoading) {
    return (
      <div
        className={`text-center text-gray-600 dark:text-gray-400 ${className}`}
      >
        Loading...
      </div>
    );
  }

  // 데이터가 있는 상태에서의 갱신
  if (isFetching) {
    return (
      <div className={`text-sm text-brand-primary ${className}`}>
        <span className="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return null;
};

export default LoadingIndicator;
