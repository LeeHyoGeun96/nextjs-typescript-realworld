export const fetchArticles = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    credentials: "include", // 쿠키 포함
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 401) {
    }
    return null;
  }
  return response.json();
};
