"use client";

import NavLink from "@/components/NavLink";
import {
  EditIcon,
  HomeIcon,
  LoginIcon,
  RegisterIcon,
  SettingsIcon,
} from "./icons";

import { TimestampAvatar } from "../Avata/TimestampAvatar";

import { useUser } from "@/hooks/useUser";

interface NavLinksProps {
  isMobile?: boolean;
}

export const NavLinks = ({ isMobile }: NavLinksProps) => {
  const { user, isLoggedIn } = useUser();

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
              <TimestampAvatar
                user={user}
                size={isMobile ? "sm" : "md"}
                className={isMobile ? "" : "mr-1"}
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
