import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="mb-6 text-2xl font-semibold">Log in</h1>
      <AuthForm mode="login" />
      <p className="mt-4 text-sm text-white/50">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-white hover:underline">
          Sign up
        </Link>
      </p>
    </main>
  );
}
