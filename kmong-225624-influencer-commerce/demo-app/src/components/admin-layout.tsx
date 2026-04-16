"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface AdminLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  accentColor: string;
  sidebarBg: string;
  title: string;
}

function SidebarNav({
  items,
  pathname,
  accentColor,
  title,
  sidebarBg,
}: {
  items: SidebarItem[];
  pathname: string;
  accentColor: string;
  title: string;
  sidebarBg: string;
}) {
  return (
    <div
      className="flex h-full w-64 flex-col"
      style={{ backgroundColor: sidebarBg }}
    >
      <div className="flex h-16 items-center gap-3 px-6 border-b border-white/10">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white font-bold text-sm"
          style={{ backgroundColor: accentColor }}
        >
          K
        </div>
        <span className="text-white font-semibold text-lg">{title}</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname === item.href + "/" || pathname.endsWith(item.href) || pathname.endsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white/90"
              }`}
              style={isActive ? { backgroundColor: `${accentColor}33` } : undefined}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function AdminLayout({
  children,
  sidebarItems,
  accentColor,
  sidebarBg,
  title,
}: AdminLayoutProps) {
  const pathname = usePathname();
  const { userName } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentPage =
    sidebarItems.find((item) => item.href === pathname)?.label ?? title;

  return (
    <div className="flex h-screen overflow-hidden" id="admin-layout">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-shrink-0">
        <SidebarNav
          items={sidebarItems}
          pathname={pathname}
          accentColor={accentColor}
          title={title}
          sidebarBg={sidebarBg}
        />
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon-sm" className="lg:hidden" />
                }
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" showCloseButton className="w-64 p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>{title}</SheetTitle>
                </SheetHeader>
                <SidebarNav
                  items={sidebarItems}
                  pathname={pathname}
                  accentColor={accentColor}
                  title={title}
                  sidebarBg={sidebarBg}
                />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold text-gray-900">
              {currentPage}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => toast("No new notifications")}
              id="btn-notifications"
            >
              <Bell className="h-5 w-5 text-gray-500" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah"
                alt={userName || "User"}
              />
              <AvatarFallback>
                {(userName || "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content */}
        <main
          className="flex-1 overflow-y-auto p-4 lg:p-8"
          style={{ backgroundColor: "#F8FAFC" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
