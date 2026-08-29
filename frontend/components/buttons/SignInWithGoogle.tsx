import { signInWithGoogle } from "@/auth-actions";
import GoogleIcon from "../icons/googleIcon";

export default function SignInWithGoogle() {
  return (
    <>
      <form action={signInWithGoogle}>
        <button
          type="submit"
          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-sm font-medium hover:bg-gray-100"
        >
          <GoogleIcon />
        </button>
      </form>
    </>
  );
}
