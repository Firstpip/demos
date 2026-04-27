"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { UserType } from "@/lib/types";

interface Props {
  children: React.ReactNode;
  allow?: UserType[];
  requireLogin?: boolean;
  guestOnly?: boolean;
  fallbackPath?: string;
}

export default function AuthGuard({
  children,
  allow,
  requireLogin = false,
  guestOnly = false,
  fallbackPath,
}: Props) {
  const { session, hydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || "/";
  const redirected = useRef(false);

  useEffect(() => {
    if (!hydrated || redirected.current) return;

    if (guestOnly && session) {
      redirected.current = true;
      router.replace("/");
      return;
    }
    if (requireLogin && !session) {
      redirected.current = true;
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (allow && session && !allow.includes(session.type)) {
      redirected.current = true;
      router.replace(fallbackPath || "/");
      return;
    }
    if (allow && !session) {
      redirected.current = true;
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
  }, [hydrated, session, router, pathname, allow, requireLogin, guestOnly, fallbackPath]);

  if (!hydrated) {
    return (
      <div className="demo-container py-24 text-center text-sm text-[var(--color-muted)]">
        불러오는 중…
      </div>
    );
  }

  if (guestOnly && session) return null;
  if (requireLogin && !session) return null;
  if (allow && (!session || !allow.includes(session.type))) return null;

  return <>{children}</>;
}
