import type { Metadata } from 'next'
import { Geist_Mono } from 'next/font/google'
import { Providers } from '@/components/Providers'
import './globals.css'

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: '가구몰 — 30개 조합사 통합 쇼핑몰',
  description: '가구전문 브랜드 통합 쇼핑몰. 컬렉션·룩북·브랜드 셋업과 배송 예약·자동 보상·조합사 권한 분리 CMS 흐름을 시연하는 데모.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${geistMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
