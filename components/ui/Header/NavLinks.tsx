"use client";

import NavLink from "@/components/NavLink";
import {
  EditIcon,
  HomeIcon,
  LoginIcon,
  RegisterIcon,
  SettingsIcon,
} from "./icons";
import Avatar from "@/components/Avatar";
import { User } from "@/types/authTypes";
import { useEffect, useState } from "react";

interface NavLinksProps {
  user: Pick<User, "image" | "username"> | null;
  isMobile?: boolean;
}

export const NavLinks = ({ isMobile, user }: NavLinksProps) => {
  const [timestamp, setTimestamp] = useState("");
  const isLoggedIn = !!user;

  useEffect(() => {
    // 클라이언트 사이드에서만 timestamp 생성
    if (user?.image) {
      setTimestamp(Date.now().toString());
    }
  }, [user?.image]);

  return (
    <>
      <li className="md:translate-y-[1px]">{/* <DarkModeToggle /> */}</li>
      <li>
        <NavLink href="/" isMobile={isMobile} end>
          {isMobile && <HomeIcon />}
          <span>Home</span>
        </NavLink>
      </li>
      {isLoggedIn ? (
        <>
          <li>
            <NavLink href="/editor" isMobile={isMobile}>
              {isMobile && <EditIcon />}
              <span>New Article</span>
            </NavLink>
          </li>
          <li>
            <NavLink href="/settings" isMobile={isMobile}>
              {isMobile && <SettingsIcon />}
              <span>Settings</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              href={`/profile/${user?.username}`}
              isMobile={isMobile}
              classes="md:flex md:gap-1 md:translate-y-[1px]"
            >
              <Avatar
                username={user?.username || ""}
                image={user?.image}
                size={isMobile ? "sm" : "md"}
                className={isMobile ? "" : "mr-1"}
                timestamp={timestamp}
              />
              <span className="translate-y-[1px] lg:translate-y-[2px]">
                {user?.username}
              </span>
            </NavLink>
          </li>
        </>
      ) : (
        <>
          <li>
            <NavLink href="/login" isMobile={isMobile}>
              {isMobile && <LoginIcon />}
              <span>Sign in</span>
            </NavLink>
          </li>
          <li>
            <NavLink href="/register" isMobile={isMobile}>
              {isMobile && <RegisterIcon />}
              <span>Sign up</span>
            </NavLink>
          </li>
        </>
      )}
    </>
  );
};
