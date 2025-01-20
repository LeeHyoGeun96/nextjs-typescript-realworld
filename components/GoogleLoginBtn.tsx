import { signInWithGoogle } from "@/actions/auth";

export default function GoogleLoginBtn() {
  return (
    <form action={signInWithGoogle}>
      <button type="submit" className="flex items-center justify-center gap-2">
        Login with Google
      </button>
    </form>
  );
}
