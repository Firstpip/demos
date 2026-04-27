"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const isAdmin = pathname.startsWith("/admin");
  const isLoginFlow = pathname === "/login" || pathname === "/signup";

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {!isLoginFlow && <Header />}
      <main id="main-content">{children}</main>
      {!isLoginFlow && <Footer />}
    </>
  );
}
