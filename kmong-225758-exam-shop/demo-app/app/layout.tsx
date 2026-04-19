import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider, CartProvider, ToastProvider } from "@/lib/context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "에듀프레스 | 모의고사 교재 전문 서점",
  description: "수험생을 위한 최고의 모의고사 교재 전문 온라인 서점. 국어/영어/수학/사회/과학 전 과목 준비.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#1E293B]">
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
