import Link from "next/link";

const Footer = () => {
  return (
    <footer className="pt-9 pb-20 sm:py-9 sm:pb-24 md:pb-9  bg-zinc-100 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <nav className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
          <Link
            href="/"
            className="text-green-500 dark:text-green-400 text-xl font-bold hover:text-green-600 dark:hover:text-green-300 transition-colors"
            aria-label="홈으로 이동"
          >
            conduit
          </Link>
          <p className="text-gray-600 dark:text-gray-300 text-sm text-center">
            An interactive learning project from{" "}
            <a
              href="https://thinkster.io"
              className="text-green-500 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Thinkster 웹사이트로 이동"
            >
              Thinkster
            </a>
            . Code &amp; design licensed under MIT.
          </p>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
