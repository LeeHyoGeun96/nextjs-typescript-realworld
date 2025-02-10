export const API_ENDPOINTS = {
  CURRENT_USER: "/api/currentUser",
  // 다른 API 엔드포인트들...
} as const;

export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];
