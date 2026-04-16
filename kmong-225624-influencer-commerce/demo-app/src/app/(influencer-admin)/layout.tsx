"use client";

import { AdminLayout, type SidebarItem } from "@/components/admin-layout";
import {
  LayoutDashboard,
  DollarSign,
  Link,
  Package,
  Settings,
} from "lucide-react";

const sidebarItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/influencer/dashboard" },
  { icon: DollarSign, label: "Earnings", href: "/influencer/earnings" },
  { icon: Link, label: "My Links", href: "/influencer/links" },
  { icon: Package, label: "Products", href: "/influencer/products" },
  { icon: Settings, label: "Settings", href: "/influencer/settings" },
];

export default function InfluencerAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayout
      sidebarItems={sidebarItems}
      accentColor="#6366F1"
      sidebarBg="#1E1B4B"
      title="Influencer Dashboard"
    >
      {children}
    </AdminLayout>
  );
}
