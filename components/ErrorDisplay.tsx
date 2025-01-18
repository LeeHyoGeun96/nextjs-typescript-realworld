import { AuthState } from "@/types/authTypes";

interface ErrorDisplayProps {
  authState: AuthState | void;
  field: string;
}

export const ErrorDisplay = ({ authState, field }: ErrorDisplayProps) => {
  if (!authState) {
    return null;
  }

  if (authState.isValid) {
    return null;
  }

  if (!authState.errors[field]) {
    return null;
  }

  return (
    <p className="p-4 text-red-500 font-bold">
      <span className="mr-2">•</span>
      {authState.errors[field]}
    </p>
  );
};
