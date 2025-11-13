import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Auto Pailot Tester - 非エンジニア向けテスト自動化ツール',
  description: '完全無料、コード不要。Vibe Coding対応のテスト自動化ツール。Claude Code、Cursor、Windsurf等のAIツールと連携可能。',
  keywords: ['テスト自動化', 'Playwright', 'Puppeteer', 'ノーコード', 'Vibe Coding', 'AI', '無料'],
  authors: [{ name: 'Auto Pailot Team' }],
  openGraph: {
    title: 'Auto Pailot Tester - 非エンジニア向けテスト自動化ツール',
    description: '完全無料、コード不要。Vibe Coding対応のテスト自動化ツール',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
