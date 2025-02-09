"use client";

import { Input } from "../Input";
import useSWR from "swr";
import { Button } from "../ui/Button/Button";
import { useActionState } from "react";
import { ChangeUserInfo } from "@/actions/auth";
import { ErrorDisplay } from "../ErrorDisplay";

export default function SettingForm() {
  const [state, formAction] = useActionState(ChangeUserInfo, {
    success: false,
    error: undefined,
    value: {
      username: "",
      bio: "",
    },
  });

  const { data: user, mutate } = useSWR("/api/currentUser");

  const handleSubmit = async (formData: FormData) => {
    const newUser = {
      username: formData.get("username"),
      bio: formData.get("bio"),
    };

    await mutate(
      async () => {
        formAction(formData);
        return { ...user, ...newUser };
      },
      {
        optimisticData: { ...user, ...newUser },
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
