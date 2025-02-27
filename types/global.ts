export type SearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export type Params = Promise<{ slug: string }>;
