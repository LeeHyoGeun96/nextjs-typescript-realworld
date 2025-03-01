// 도메인 타입

import { ActionState } from "./global";

export interface ProfileType {
  username: string;
  bio: string | null;
  image: string | null;
  following: boolean;
  isMe: boolean;
}

export interface ProfileResponse {
  profile: ProfileType;
}

export type FollowUserState = ActionState<{
  responseData: ProfileResponse;
}>;

export type updateAvatarState = ActionState<{
  publicUrl: string;
}>;

export type deleteAvatarState = ActionState<void>;

// API 요청 파라미터 타입들
export interface GetProfileRequestParams {
  username: string;
  token?: string;
}

export interface FollowUserRequestParams {
  username: string;
  token: string;
}

export interface UnfollowUserRequestParams {
  username: string;
  token: string;
}

// API 응답 타입들
export interface GetProfileResponse {
  profile: ProfileType;
}

export interface FollowUserResponse {
  profile: ProfileType;
}

export type UnfollowUserResponse = void;
