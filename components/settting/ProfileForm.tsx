"use client";

import { Input } from "../Input";
import { Button } from "../ui/Button/Button";
import { useActionState } from "react";
import { updateProfile } from "@/actions/auth";
import { ErrorDisplay } from "../ErrorDisplay";
import { ResponseUserType } from "@/types/authTypes";
import { useUser } from "@/hooks/useUser";

export default function SettingForm() {
  const [state, formAction] = useActionState(updateProfile, {
    success: false,
    error: null,
    value: { inputData: { username: "", bio: "" } },
  });

  const { user, mutate } = useUser();

  const handleSubmit = async (formData: FormData) => {
    const newUser = {
      username: formData.get("username"),
      bio: formData.get("bio"),
    };

    formAction(formData);

    await mutate(
      async (prevData: ResponseUserType | undefined) => {
        return {
          ...prevData,
          user: { ...prevData?.user, ...newUser },
        };
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
      }
    );
  };

  return (
    <>
      <ErrorDisplay message={state.error?.message} />

      <form className="space-y-6" action={handleSubmit}>
        <div className="space-y-4">
          <div className="form-group">
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Your Name"
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
              placeholder="Short bio about you"
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
