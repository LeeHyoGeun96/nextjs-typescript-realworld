export const PROTECTED_ROUTES = ["/editor", "/settings", "/profile"];
export const COOCIE_OPTIONS = {
  httpOnly: process.env.NEXT_PUBLIC_NODE_ENV !== "development",
  secure: process.env.NEXT_PUBLIC_NODE_ENV !== "development",
  path: "/",
};
