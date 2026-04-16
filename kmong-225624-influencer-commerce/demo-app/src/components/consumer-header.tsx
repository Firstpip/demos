"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingCart, Search, Menu, User, LogOut, ChevronDown } from "lucide-react";
// ChevronDown still used by role switcher and mobile menu
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { categories, type Role } from "@/lib/data";

const roleLabels: Record<Role, string> = {
  consumer: "소비자",
  influencer: "인플루언서",
  vendor: "입점사",
  admin: "관리자",
};

const rolePaths: Record<Role, string> = {
  consumer: "/",
  influencer: "/influencer/dashboard/",
  vendor: "/vendor/dashboard/",
  admin: "/admin/dashboard/",
};

export function ConsumerHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, userName, role, login, logout, switchRole } = useAuth();
  const { totalItems } = useCart();
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products/?q=${encodeURIComponent(search.trim())}`);
      setMobileOpen(false);
    }
  };

  const handleRoleSwitch = (r: Role) => {
    switchRole(r);
    router.push(rolePaths[r]);
  };

  return (
    <header id="consumer-header" className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="shrink-0 text-xl font-extrabold text-[#2563EB]">
          KWAVE
        </Link>

        {/* Search - desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="header-search"
              placeholder="상품 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
        </form>

        <div className="flex-1 md:hidden" />

        {/* Role switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1 text-xs" />}>
              {roleLabels[role]} <ChevronDown className="h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(Object.keys(roleLabels) as Role[]).map((r) => (
              <DropdownMenuItem
                key={r}
                onClick={() => handleRoleSwitch(r)}
                className={r === role ? "bg-blue-50 font-semibold" : ""}
              >
                {roleLabels[r]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Cart */}
        <Link href="/cart/" className="relative">
          <ShoppingCart className="h-5 w-5 text-gray-700" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center rounded-full bg-[#2563EB] text-[10px] text-white px-1 hover:bg-[#2563EB]">
              {totalItems}
            </Badge>
          )}
        </Link>

        {/* User menu - desktop */}
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1" />}>
                <User className="h-4 w-4" />
                <span className="text-sm">{userName}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push("/mypage/")}>
                마이페이지
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { logout(); router.push("/"); }}>
                <LogOut className="h-4 w-4 mr-2" /> 로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            size="sm"
            className="hidden md:inline-flex bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
            onClick={() => router.push("/login/")}
          >
            로그인
          </Button>
        )}

        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
              <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle className="text-left text-[#2563EB] font-extrabold">KWAVE</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              {/* Mobile search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="상품 검색..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>

              {/* Mobile categories */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">카테고리</p>
                <ul className="space-y-1">
                  {categories.map((c) => (
                    <li key={c.id}>
                      <button
                        className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100"
                        onClick={() => { router.push(`/products/?category=${c.id}`); setMobileOpen(false); }}
                      >
                        {c.icon} {c.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mobile role switcher */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">역할 전환</p>
                <ul className="space-y-1">
                  {(Object.keys(roleLabels) as Role[]).map((r) => (
                    <li key={r}>
                      <button
                        className={`w-full text-left px-2 py-1.5 text-sm rounded ${r === role ? "bg-blue-50 text-[#2563EB] font-semibold" : "hover:bg-gray-100"}`}
                        onClick={() => { handleRoleSwitch(r); setMobileOpen(false); }}
                      >
                        {roleLabels[r]}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mobile auth */}
              <div className="border-t pt-4">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{userName}님</p>
                    <Button variant="outline" className="w-full" onClick={() => { router.push("/mypage/"); setMobileOpen(false); }}>
                      마이페이지
                    </Button>
                    <Button variant="ghost" className="w-full text-red-500" onClick={() => { logout(); router.push("/"); setMobileOpen(false); }}>
                      로그아웃
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white" onClick={() => { router.push("/login/"); setMobileOpen(false); }}>
                    로그인
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
