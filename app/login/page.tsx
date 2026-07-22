import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";
import { RobloxSignInButton } from "@/components/auth/RobloxSignInButton";
import { OAuthErrorBanner } from "@/components/auth/OAuthErrorBanner";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="mb-6 text-2xl font-semibold">Log in</h1>
      <OAuthErrorBanner error={error} />
      <RobloxSignInButton />
      <div className="my-4 flex items-center gap-3 text-xs text-white/40">
        <div className="h-px flex-1 bg-white/10" />
        or
        <div className="h-px flex-1 bg-white/10" />
      </div>
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
