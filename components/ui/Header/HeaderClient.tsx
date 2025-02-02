"use client";

import Link from "next/link";
import { NavLinks } from "./NavLinks";
import useSWR from "swr";
import { getCurrentUserClient } from "@/utils/supabase/getCurrentUserClient";
import { API_ENDPOINTS } from "@/constant/api";

export default function HeaderClient() {
  const { data: user } = useSWR(API_ENDPOINTS.CURRENT_USER, () =>
    getCurrentUserClient(["image", "username"])
  );

  return (
    <>
      <section className="hidden md:block sticky top-0 bg-white dark:bg-gray-700 shadow-sm z-10">
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link className="text-brand-primary text-xl font-bold" href="/">
              conduit
            </Link>
            <ul className="flex items-center space-x-6">
              <NavLinks user={user!} />
            </ul>
          </div>
        </nav>
      </section>

      <section
        id="mobile-header"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-200 ease-in-out"
      >
        <div className="absolute inset-0 bg-white dark:bg-gray-800 shadow-[0_-1px_3px_rgba(0,0,0,0.1)] dark:shadow-[0_-1px_3px_rgba(0,0,0,0.3)]" />
        <nav className="relative container mx-auto px-4">
          <ul className="flex items-center justify-around h-16">
            <NavLinks user={user!} isMobile={true} />
          </ul>
        </nav>
      </section>
    </>
  );
}
