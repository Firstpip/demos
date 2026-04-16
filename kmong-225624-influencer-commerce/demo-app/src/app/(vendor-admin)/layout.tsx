"use client";

import { AdminLayout, type SidebarItem } from "@/components/admin-layout";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wallet,
  Settings,
} from "lucide-react";

const sidebarItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "대시보드", href: "/vendor/dashboard" },
  { icon: Package, label: "상품 관리", href: "/vendor/products" },
  { icon: ShoppingCart, label: "주문 내역", href: "/vendor/orders" },
  { icon: Wallet, label: "정산 관리", href: "/vendor/settlements" },
  { icon: Settings, label: "설정", href: "/vendor/settings" },
];

export default function VendorAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayout
      sidebarItems={sidebarItems}
      accentColor="#0D9488"
      sidebarBg="#134E4A"
      title="공급사 관리"
    >
      {children}
    </AdminLayout>
  );
}
