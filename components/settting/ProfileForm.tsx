"use client";

import { Input } from "../Input";
import { Button } from "../ui/Button/Button";
import { updateProfile } from "@/actions/auth";
import { ErrorDisplay } from "../ErrorDisplay";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";
import {
  handleApiError,
  handleUnexpectedError,
} from "@/utils/error/errorHandle";
import { ResponseUserType } from "@/types/authTypes";

export default function SettingForm() {
  const { user, mutate } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [unexpectError, setUnexpectError] = useState<string | null>(null);

  if (unexpectError) {
    throw new Error(unexpectError);
  }

  const handleSubmit = async (formData: FormData) => {
    // 낙관적 업데이트
    const newUser = {
      username: formData.get("username")?.toString() || "",
      bio: formData.get("bio")?.toString() || "",
    };

    if (!newUser.username) {
      setError("사용자 이름을 입력해주세요.");
      return;
    }

    await mutate(
      async (prevData: ResponseUserType | undefined) => {
        try {
          const updateProfileResponse = await updateProfile(formData);

          handleApiError(
            updateProfileResponse,
            "프로필 업데이트 실패",
            setError
          );

          return (
            updateProfileResponse.value?.responseData || {
              ...prevData,
              user: { ...prevData?.user, ...newUser },
            }
          );
        } catch (error) {
          handleUnexpectedError(error, "프로필 업데이트", setUnexpectError);
        }
      },
      {
        optimisticData: (prevData: ResponseUserType | undefined) => {
          return {
            ...prevData,
            user: { ...prevData?.user, ...newUser },
          };
        },
        rollbackOnError: true,
        revalidate: false,
        populateCache: true,
      }
    );
  };

  return (
    <>
      <ErrorDisplay message={error} />

      <form className="space-y-6" action={handleSubmit}>
        <div className="space-y-4">
          <div className="form-group">
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="사용자 이름"
              defaultValue={user?.username || ""}
              name="username"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio" className="sr-only">
              Bio
            </label>
            <Input
              id="bio"
              isTextArea
              placeholder="자기소개"
              defaultValue={user?.bio || ""}
              name="bio"
              className="min-h-[200px]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg">
            프로필 수정하기
          </Button>
        </div>
      </form>
    </>
  );
}
