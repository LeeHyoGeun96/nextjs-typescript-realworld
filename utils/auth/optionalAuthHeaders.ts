export const optionalAuthHeaders = (token: string | undefined) => {
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
