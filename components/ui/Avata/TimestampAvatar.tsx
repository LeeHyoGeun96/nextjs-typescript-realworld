"use client";

import { useState, useEffect } from "react";
import { CurrentUserType } from "@/types/authTypes";
import Avatar, { TimestampAvatarSize } from "./Avatar";

interface TimestampAvatarProps {
  user: Pick<CurrentUserType, "image" | "username"> | null | undefined;
  size?: TimestampAvatarSize;
  className?: string;
}

export function TimestampAvatar({
  user,
  size = "md",
  className = "",
}: TimestampAvatarProps) {
  const [timestamp, setTimestamp] = useState<string>("");

  useEffect(() => {
    if (user?.image) {
      setTimestamp(Date.now().toString());
    }
  }, [user?.image]);

  return (
    <Avatar
      username={user?.username || ""}
      image={user?.image}
      size={size}
      className={className}
      timestamp={timestamp}
    />
  );
}
