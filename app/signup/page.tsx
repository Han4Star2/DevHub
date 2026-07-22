import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="mb-6 text-2xl font-semibold">Create your account</h1>
      <AuthForm mode="signup" />
      <p className="mt-4 text-sm text-white/50">
        Already have an account?{" "}
        <Link href="/login" className="text-white hover:underline">
          Log in
        </Link>
      </p>
    </main>
  );
}
