"use client";

import { AdminLayout, type SidebarItem } from "@/components/admin-layout";
import {
  LayoutDashboard,
  Users,
  Package,
  GitBranch,
  ShoppingCart,
  Wallet,
  Tag,
  BarChart3,
  FolderTree,
} from "lucide-react";

const sidebarItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "대시보드", href: "/admin/dashboard" },
  { icon: Users, label: "사용자 관리", href: "/admin/users" },
  { icon: Package, label: "상품 관리", href: "/admin/products" },
  { icon: GitBranch, label: "매칭 관리", href: "/admin/matching" },
  { icon: ShoppingCart, label: "주문 관리", href: "/admin/orders" },
  { icon: Wallet, label: "정산 관리", href: "/admin/settlements" },
  { icon: Tag, label: "프로모션", href: "/admin/promotions" },
  { icon: BarChart3, label: "리포트", href: "/admin/reports" },
  { icon: FolderTree, label: "카테고리", href: "/admin/categories" },
];

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayout
      sidebarItems={sidebarItems}
      accentColor="#0D6EFD"
      sidebarBg="#1E3A5F"
      title="관리자"
    >
      {children}
    </AdminLayout>
  );
}
