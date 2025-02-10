import Link from "next/link";
import { ErrorDisplay } from "../ErrorDisplay";
import { Button } from "../ui/Button/Button";
import GoogleLoginBtn from "../GoogleLoginBtn";

export interface AuthFormProps {
  title: string;
  switchText: string;
  switchLink: string;
  action: (payload: FormData) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string;
  clientIsValid?: boolean;
  isPending: boolean;
}

type AuthFormWrapperProps = AuthFormProps & {
  children: React.ReactNode;
};

export const AuthFormWrapper = ({
  title,
  switchText,
  switchLink,
  action,
  onSubmit,
  error,
  clientIsValid,
  isPending,
  children,
}: AuthFormWrapperProps) => {
  return (
    <div className="container mx-auto px-4 pt-4">
      <div className="flex justify-center">
        <section className="w-full max-w-md">
          <header className="mb-8">
            <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="text-center mt-2">
              <Link
                href={switchLink}
                className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
              >
                {switchText}
              </Link>
            </p>
          </header>

          <form className="space-y-6" action={action} onSubmit={onSubmit}>
            <ErrorDisplay message={error} />
            {children}
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              type="submit"
              disabled={isPending || !clientIsValid}
            >
              {title}
            </Button>
          </form>

          <section className="mt-8">
            <div className="mt-6">
              <GoogleLoginBtn
                type={title.toLowerCase() as "login" | "register"}
              />
            </div>
          </section>
        </section>
      </div>
    </div>
  );
};
