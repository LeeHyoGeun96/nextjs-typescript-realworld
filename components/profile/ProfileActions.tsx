"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import useSWR from "swr";
import { ProfileResponse } from "@/types/profileTypes";
import { followUser, unfollowUser } from "@/actions/profile";
import {
  handleApiError,
  handleUnexpectedError,
} from "@/utils/error/errorHandle";
import { useState } from "react";

interface ProfileActionsProps {
  apiKeys: {
    profileKey: string;
  };
  initialData: Record<string, unknown>;
}

export default function ProfileActions({
  apiKeys,
  initialData,
}: ProfileActionsProps) {
  const router = useRouter();
  const { isLoggedIn } = useUser();
  const [unExpectedError, setUnExpectedError] = useState<string | null>(null);
  const {
    data: profileResponse,
    mutate: mutateProfile,
    isLoading: isProfileLoading,
  } = useSWR<ProfileResponse>(apiKeys.profileKey, {
    fallbackData: initialData[apiKeys.profileKey] as ProfileResponse,
  });

  if (unExpectedError) {
    throw new Error(unExpectedError);
  }

  if (!profileResponse) {
    return <div>데이터를 불러오는데 실패했습니다</div>;
  }
  const profile = profileResponse.profile;
  const { username, following, isMe: isSameUser } = profile;

  const confirmLogin = () => {
    const confirmed = window.confirm(
      "로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?"
    );
    if (confirmed) {
      router.push("/login");
    }
  };

  const handleFollow = async (following: boolean, username: string) => {
    if (isProfileLoading) return;
    if (!isLoggedIn) {
      confirmLogin();
      return;
    }

    await mutateProfile(
      async (prevData: ProfileResponse | undefined) => {
        if (!prevData) return profileResponse;
        if (following) {
          try {
            const response = await unfollowUser(username);
            handleApiError(response, "언팔로우 처리에 실패했습니다.");
            return response.value?.responseData;
          } catch (error) {
            handleUnexpectedError(error, "언팔로우 처리", setUnExpectedError);
          }
        } else {
          try {
            const response = await followUser(username);
            handleApiError(response, "팔로우 처리에 실패했습니다.");
            return response.value?.responseData;
          } catch (error) {
            handleUnexpectedError(error, "팔로우 처리", setUnExpectedError);
          }
        }
      },
      {
        optimisticData: (prevData: ProfileResponse | undefined) => {
          if (!prevData) return profileResponse;
          if (following) {
            return {
              ...prevData,
              profile: {
                ...prevData.profile,
                following: false,
              },
            };
          } else {
            return {
              ...prevData,
              profile: {
                ...prevData.profile,
                following: true,
              },
            };
          }
        },
        rollbackOnError: true,
        revalidate: false,
        populateCache: true,
      }
    );

    router.refresh();
  };

  return (
    <div className="flex justify-center">
      {isSameUser ? (
        <Link
          href="/settings"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          aria-label="프로필 설정 편집"
        >
          <i className="ion-gear-a mr-1" aria-hidden="true"></i>
          <span>Edit Profile Settings</span>
        </Link>
      ) : (
        <button
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          onClick={() => handleFollow(following, username)}
          aria-pressed={following}
        >
          <i
            className={`${
              following ? "ion-minus-round" : "ion-plus-round"
            } mr-1`}
            aria-hidden="true"
          ></i>
          <span>
            {following ? "Unfollow" : "Follow"} {username}
          </span>
        </button>
      )}
    </div>
  );
}
