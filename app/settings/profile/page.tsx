import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";
import { ProfileForm } from "@/components/settings/ProfileForm";

export default async function ProfileSettingsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <main className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <Link href="/dashboard" className="text-sm text-white/50 hover:text-white">
        ← Back to Dashboard
      </Link>
      <h1 className="mt-4 mb-6 text-2xl font-semibold">Profile settings</h1>
      <ProfileForm user={user} />
    </main>
  );
}
