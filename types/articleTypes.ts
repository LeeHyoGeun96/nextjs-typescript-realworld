import { ActionState } from "./global";

// 도메인 타입들
export interface AuthorType {
  username: string;
  bio?: string;
  image?: string;
  following: boolean;
}

export interface ArticleType {
  title: string;
  slug: string;
  body: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  tagList: string[];
  favoritesCount: number;
  favorited: boolean;
  author: AuthorType;
}

export interface ArticleResponse {
  article: ArticleType;
}

export interface ArticlesResponse {
  articles: ArticleType[];
  articlesCount: number;
}

export interface CommentType {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: AuthorType;
}

export interface CommentsResponse {
  comments: CommentType[];
}

export interface CommentResponse {
  comment: CommentType;
}

export type createArticleState = ActionState<{
  inputData: {
    title: string;
    description: string;
    body: string;
    tagList: string[];
  };
}>;

export type updateArticleState = createArticleState;

export type favoriteArticleState = ActionState<never>;

export type addCommentState = ActionState<{
  responseData: CommentResponse;
}>;

export type deleteCommentState = ActionState<never>;

export type deleteArticleState = ActionState<never>;

export interface ArticleFormType {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

// API 요청 파라미터 타입들
export interface GetUniqueArticleRequestParams {
  slug: string;
  token?: string;
}

export interface CreateArticleRequestParams {
  article: ArticleFormType;
  token: string;
}

export interface UpdateArticleRequestParams {
  slug: string;
  article: ArticleFormType;
  token: string;
}

export interface DeleteArticleRequestParams {
  slug: string;
  token: string;
}

export interface GetCommentsByArticleRequestParams {
  slug: string;
  token?: string;
}

export interface AddCommentRequestParams {
  comment: string;
  slug: string;
  token: string;
}

export interface DeleteCommentRequestParams {
  slug: string;
  id: number;
  token: string;
}

export interface ArticlesQueryRequestParams {
  token?: string;
  tag?: string;
  author?: string;
  favorited?: string;
  offset: number;
  limit: number;
}

export interface FeedQueryRequestParams {
  offset: number;
  limit: number;
  token: string;
}

export interface FavoriteArticleRequestParams {
  slug: string;
  token: string;
}

// API 응답 타입들
export interface GetUniqueArticleResponse {
  article: ArticleType;
}

export interface CreateArticleResponse {
  article: ArticleType;
}

export interface UpdateArticleResponse {
  article: ArticleType;
}

export interface GetCommentsByArticleResponse {
  comments: CommentType[];
}

export interface AddCommentResponse {
  comment: CommentType;
}

export interface ArticlesResponse {
  articles: ArticleType[];
  articlesCount: number;
}

export interface FeedQueryResponse {
  articles: ArticleType[];
  articlesCount: number;
}

export interface FavoriteArticleResponse {
  article: ArticleType;
}

// DTO 타입들
export type GetUniqueArticleDTO = Omit<GetUniqueArticleRequestParams, "token">;

export type CreateArticleDTO = Omit<CreateArticleRequestParams, "token">;

export type UpdateArticleDTO = Omit<
  UpdateArticleRequestParams,
  "token" | "slug"
>;

export type AddCommentDTO = {
  comment: {
    body: string;
  };
};

// 재사용 타입들
export type UnfavoriteArticleRequestParams = FavoriteArticleRequestParams;
export type UnfavoriteArticleResponse = FavoriteArticleResponse;
