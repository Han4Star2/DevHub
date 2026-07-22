import { Badge } from "../ui/Badge";
import { formatDate } from "@/lib/utils/format";

export interface ProfileHeaderData {
  username: string;
  name: string | null;
  bio: string | null;
  skills: string | null;
  avatarUrl: string | null;
  createdAt: Date;
}

function initials(name: string | null, username: string) {
  const source = name?.trim() || username;
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function ProfileHeader({ profile }: { profile: ProfileHeaderData }) {
  const skillList = profile.skills
    ? profile.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full bg-white/10">
        {profile.avatarUrl ? (
          // arbitrary user-supplied URL, can't be pre-registered in next.config remotePatterns
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt={profile.username}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-white/70">
            {initials(profile.name, profile.username)}
          </div>
        )}
      </div>
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold">
          {profile.name || profile.username}
        </h1>
        <p className="text-white/50">@{profile.username}</p>
        {profile.bio && (
          <p className="mt-2 max-w-2xl text-sm text-white/70">{profile.bio}</p>
        )}
        {skillList.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {skillList.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </div>
        )}
        <p className="mt-2 text-xs text-white/40">
          Member since {formatDate(profile.createdAt)}
        </p>
      </div>
    </div>
  );
}
