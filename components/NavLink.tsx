"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps extends LinkProps {
  children: React.ReactNode;
  isMobile?: boolean;
  classes?: string;
  end?: boolean;
}

export default function NavLink({
  children,
  isMobile = false,
  classes = "",
  end = false,
  ...props
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = end
    ? pathname === props.href.toString()
    : pathname.startsWith(props.href.toString());

  const linkClass = ({
    classes,
    isActive,
  }: {
    classes: string;
    isActive: boolean;
  }) =>
    isMobile
      ? `${classes} flex flex-col items-center text-sm ${
          isActive ? "text-brand-primary" : "text-gray-500"
        }`
      : `${classes} hover:text-brand-primary transition-colors ${
          isActive ? "text-brand-primary" : "text-gray-600 dark:text-gray-300"
        }`;

  const css = linkClass({ isActive, classes });

  return (
    <Link className={css} {...props}>
      {children}
    </Link>
  );
}
