// import { ActionFunctionArgs, redirect, useActionData } from "react-router-dom";
// import AuthForm from "../components/AuthForm";
// import { QueryClient } from "@tanstack/react-query";
// import NetworkError from "../errors/NetworkError";
// import { authQueryOptions } from "../queryOptions/authQueryOptions";
// import { useUserStore } from "../store/userStore";

import AuthForm from "@/components/AuthForm";

// export const action =
//   (queryClient: QueryClient) =>
//   async ({ request }: ActionFunctionArgs) => {
//     const formData = await request.formData();
//     const { login: loginFn } = useUserStore.getState();
//     if (!formData.get("email") || !formData.get("password")) {
//       return new NetworkError({
//         code: 400,
//         message: "이메일과 비밀번호는 필수입니다.",
//       });
//     }

//     const email = formData.get("email") as string;
//     const password = formData.get("password") as string;

//     try {
//       const response = await queryClient.fetchQuery(
//         authQueryOptions.login({ user: { email, password } })
//       );
//       const { user } = response;
//       loginFn(user, user.token);

//       return redirect("/");
//     } catch (error) {
//       console.dir(error);
//       if (NetworkError.isNetworkError(error)) {
//         return error;
//       }
//       throw error; // 예상하지 못한 에러는 다시 던짐
//     }
//   };

// const LoginPage = () => {
//   const errors = useActionData() as NetworkError | undefined;

//   return <AuthForm type="login" errors={errors} />;
// };

// export default LoginPage;

export default function LoginPage() {
  return <AuthForm type="login" />;
}
