"use client";
import { useEffect, useState } from "react";
import zxcvbn from "zxcvbn";

export function PasswordStrength({ password }: { password: string }) {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const result = zxcvbn(password);
    setScore(result.score);
  }, [password]);

  const strengthColor = [
    "bg-red-500", // 0: 매우 약함
    "bg-orange-500", // 1: 약함
    "bg-yellow-500", // 2: 보통
    "bg-green-500", // 3: 강함
    "bg-blue-500", // 4: 매우 강함
  ][score];

  return (
    <div className="h-1 w-full bg-gray-200 mt-2">
      <div
        className={`h-full ${strengthColor} transition-all`}
        style={{ width: `${(score + 1) * 20}%` }}
      />
    </div>
  );
}
