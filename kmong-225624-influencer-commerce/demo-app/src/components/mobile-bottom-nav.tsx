"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, Search, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/", icon: Home, label: "홈" },
  { href: "/products/", icon: Grid3X3, label: "카테고리" },
  { href: "/products/?focus=search", icon: Search, label: "검색" },
  { href: "/cart/", icon: ShoppingCart, label: "장바구니", showBadge: true },
  { href: "/mypage/", icon: User, label: "마이" },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname === "";
    return pathname.startsWith(href.replace(/\/$/, ""));
  };

  return (
    <nav id="mobile-bottom-nav" className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white md:hidden">
      <div className="flex h-14 items-center justify-around">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 relative ${active ? "text-[#2563EB]" : "text-gray-500"}`}
            >
              <item.icon className="h-5 w-5" />
              {item.showBadge && totalItems > 0 && (
                <Badge className="absolute -top-1 left-1/2 h-4 min-w-4 flex items-center justify-center rounded-full bg-[#2563EB] text-[9px] text-white px-1 hover:bg-[#2563EB]">
                  {totalItems}
                </Badge>
              )}
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
