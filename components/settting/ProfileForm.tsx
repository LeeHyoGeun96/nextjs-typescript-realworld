"use client";

import { Input } from "../Input";
import useSWR from "swr";
import { Button } from "../ui/Button/Button";
// import { ErrorDisplay } from "../ErrorDisplay";

export default function SettingForm() {
  const { data: user } = useSWR("/api/currentUser");

  return (
    <>
      {/* <ErrorDisplay errors={errors} /> */}

      <form className="space-y-6">
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
