export const handleAuthError = () => {
  if (typeof window !== "undefined") {
    // 로컬스토리지 토큰 제거
    localStorage.removeItem("token");

    // 알림 표시
    window.alert("토큰이 만료되었습니다. 재로그인 해주세요.");

    // 로그인 페이지로 리다이렉트
    window.location.href = "/login"; // Next.js의 redirect는 서버 컴포넌트에서만 동작하므로 window.location 사용
  }
};
