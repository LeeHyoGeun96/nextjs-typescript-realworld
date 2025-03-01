"use client";

import { useRouter } from "next/navigation";

const confirmLogin = () => {
  const router = useRouter();
  const confirmed = window.confirm(
    "로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?"
  );
  if (confirmed) {
    router.push("/login");
  }
};

export default confirmLogin;
