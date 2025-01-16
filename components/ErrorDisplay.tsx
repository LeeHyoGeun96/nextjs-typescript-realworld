import NetworkError from "../errors/NetworkError";
import { formatValidationErrors } from "../utils/validationUtils";

interface ErrorDisplayProps {
  errors: NetworkError | undefined | null;
}

export const ErrorDisplay = ({ errors }: ErrorDisplayProps) => {
  if (!errors) return null;
  console.error(errors);

  return (
    <div className="p-4">
      {errors.code && (
        <p className="text-lg font-semibold text-red-600 mb-2">
          에러 코드: {errors.code}
        </p>
      )}
      {errors.message && <p className="text-gray-700 mb-4">{errors.message}</p>}
      {errors.errors && (
        <ul className="space-y-2 text-sm text-red-500">
          {formatValidationErrors(errors.errors).map((error) => (
            <li key={error} className="flex items-center">
              <span className="mr-2">•</span>
              {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
