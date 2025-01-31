"use client";

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";
// import { authService } from "../services/auth.service";
// import NetworkError from "../errors/NetworkError";
// import { UpdateUserRequest } from "../types/authTypes";
// import { ErrorDisplay } from "../components/ErrorDisplay";
// import LoadingIndicator from "../components/LoadingIndicator";
// import { Input } from "../components/Input";
// import { useUserStore } from "../store/userStore";

import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/Button/Button";
import { useAvatar } from "@/context/avatar/AvatarContext";
import readFileAsDataURL from "@/util/readFileAsDataURL";
import { useRouter } from "next/navigation";
import { useRef } from "react";

// const SettingsPage = () => {
//   const user = useUserStore.getState().user;
//   const { token, login, logout } = useUserStore();
//   const updateUserMutation = useMutation({
//     mutationFn: ({ data, token }: { data: UpdateUserRequest; token: string }) =>
//       authService.updateUser(data, token),
//     onSuccess: (data) => {
//       login(data.user, data.user.token);
//       window.alert("User updated successfully");
//     },
//     onError: (error) => {
//       if (NetworkError.isNetworkError(error)) {
//         return error;
//       }
//       throw error;
//     },
//   });
//   const navigate = useNavigate();
//   const { mutate: updateUser, error: errors, isPending } = updateUserMutation;

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData(e.target as HTMLFormElement);
//     if (!token) {
//       return;
//     }
//     const data = Object.fromEntries(
//       formData.entries()
//     ) as UpdateUserRequest["user"];

//     if (!user) {
//       return;
//     }

//     const hasChanges =
//       data.email !== user.email ||
//       data.username !== user.username ||
//       data.bio !== user.bio ||
//       data.image !== user.image;

//     if (!hasChanges) {
//       window.alert("변경된 내용이 없습니다.");
//       return;
//     }

//     updateUser({
//       data: { user: data },
//       token: token,
//     });
//   };

//   const queryClient = useQueryClient();

//   const handleLogout = async () => {
//     logout();
//     await queryClient.invalidateQueries({ queryKey: ["auth"] });
//     navigate("/", { replace: true });
//   };

//   if (isPending) {
//     return (
//       <div
//         role="alert"
//         className="flex justify-center items-center min-h-screen"
//       >
//         <LoadingIndicator />
//       </div>
//     );
//   }

//   return (
//     <main className="py-8  dark:bg-gray-900 min-h-screen">
//       <div className="max-w-4xl mx-auto px-4">
//         <section className="bg-white dark:bg-gray-800 rounded-lg  p-6 md:p-8">
//           <h2 className="text-5xl text-center text-gray-800 dark:text-gray-100 mb-8">
//             Your Settings
//           </h2>

//           <ErrorDisplay errors={errors} />

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="space-y-4">
//               <div className="form-group">
//                 <label htmlFor="image" className="sr-only">
//                   Profile Picture URL
//                 </label>
//                 <Input
//                   id="image"
//                   type="text"
//                   placeholder="URL of profile picture"
//                   defaultValue={user?.image || ""}
//                   name="image"
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="username" className="sr-only">
//                   Username
//                 </label>
//                 <Input
//                   id="username"
//                   type="text"
//                   placeholder="Your Name"
//                   defaultValue={user?.username || ""}
//                   name="username"
//                   autoComplete="username"
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="bio" className="sr-only">
//                   Bio
//                 </label>
//                 <Input
//                   id="bio"
//                   isTextArea
//                   placeholder="Short bio about you"
//                   defaultValue={user?.bio || ""}
//                   name="bio"
//                   className="min-h-[200px]"
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="email" className="sr-only">
//                   Email
//                 </label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="Email"
//                   defaultValue={user?.email || ""}
//                   name="email"
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="password" className="sr-only">
//                   New Password
//                 </label>
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="New Password"
//                   name="password"
//                   autoComplete="current-password"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end">
//               <button
//                 type="submit"
//                 className="px-6 py-2 bg-green-500 dark:bg-green-600
//                   text-white rounded-lg
//                   hover:bg-green-600 dark:hover:bg-green-700
//                   focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600
//                   focus:ring-offset-2 dark:focus:ring-offset-gray-800
//                   transition-colors"
//               >
//                 Update Settings
//               </button>
//             </div>
//           </form>

//           <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
//             <button
//               className="w-full px-6 py-2 text-red-500 dark:text-red-400
//                 border border-red-500 dark:border-red-400 rounded-lg
//                 hover:bg-red-50 dark:hover:bg-red-900/20
//                 focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400
//                 focus:ring-offset-2 dark:focus:ring-offset-gray-800
//                 transition-colors"
//               type="button"
//               onClick={handleLogout}
//             >
//               Or click here to logout
//             </button>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// };

// export default SettingsPage;

export default function SettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setImageData } = useAvatar();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64 = await readFileAsDataURL(file);
      setImageData(base64);
      router.push("/settings/avatar");
    }
    event.target.value = "";
  };

  return (
    <>
      <h1>SettingsPage</h1>
      <button onClick={logout}>logout</button>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div className="flex items-center gap-4">
          {/* <Avatar /> */}
          <input
            type="file"
            accept="image/*"
            className="w-full"
            onChange={handleFileChange}
            ref={fileInputRef}
            hidden
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="primary"
            size="lg"
          >
            Change Avatar
          </Button>
        </div>
      </div>
    </>
  );
}
