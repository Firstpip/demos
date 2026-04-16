import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ClientProviders from "./providers";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "배드민턴리그 - 스포츠 경기신청 및 대진표 플랫폼",
  description: "배드민턴 리그 경기신청, 대진표 확인, 랭킹 조회를 한 곳에서",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-geist)]">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
