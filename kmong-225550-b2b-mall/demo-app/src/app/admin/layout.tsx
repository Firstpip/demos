'use client';

import AuthGuard from '@/components/AuthGuard';
import AdminLayoutComponent from '@/components/AdminLayout';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requiredRole="admin">
      <AdminLayoutComponent>{children}</AdminLayoutComponent>
    </AuthGuard>
  );
}
