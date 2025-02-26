export const PROTECTED_ROUTES = ["/editor", "/settings", "/profile"];
export const COOKIE_OPTIONS = {
  httpOnly: process.env.NEXT_PUBLIC_NODE_ENV !== "development",
  secure: process.env.NEXT_PUBLIC_NODE_ENV !== "development",
  path: "/",
};
