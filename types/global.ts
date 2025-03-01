import { ApiError } from "./error";

export type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export type Params = Promise<{ slug: string }>;

export interface ActionState<T> {
  success: boolean;
  error?: ApiError | null;
  value?: T;
}
