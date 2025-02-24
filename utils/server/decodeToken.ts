import { decode } from "jsonwebtoken";

export function decodeTokenMaxAge(token: string) {
  const decoded = decode(token);

  if (!decoded || typeof decoded === "string") {
    throw new Error("Invalid token");
  }

  if (!decoded.exp || !decoded.iat) {
    throw new Error("Token does not contain exp or iat");
  }

  const maxAge = decoded.exp - decoded.iat;

  return maxAge;
}
