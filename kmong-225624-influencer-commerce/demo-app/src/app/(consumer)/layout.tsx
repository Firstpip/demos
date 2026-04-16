"use client";

import { ConsumerHeader } from "@/components/consumer-header";
import { ConsumerFooter } from "@/components/consumer-footer";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ConsumerHeader />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <ConsumerFooter />
      <MobileBottomNav />
    </>
  );
}
