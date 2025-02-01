interface ErrorDisplayProps {
  message?: string;
}

export const ErrorDisplay = ({ message }: ErrorDisplayProps) => {
  if (!message) {
    return null;
  }

  return (
    <p className="p-4 text-red-500 font-bold">
      <span className="mr-2">•</span>
      {message}
    </p>
  );
};
