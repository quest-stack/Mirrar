import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mirarr - システムの真実を映し出すテスト自動化ツール',
  description: 'ラーの鏡のようにバグを映し出す。完全無料、コード不要。Vibe Coding対応のテスト自動化ツール。Claude Code、Cursor、Windsurf等のAIツールと連携可能。',
  keywords: ['Mirarr', 'ミラー', 'テスト自動化', 'Playwright', 'Puppeteer', 'ノーコード', 'Vibe Coding', 'AI', '無料', 'ドラクエ', 'ラーの鏡'],
  authors: [{ name: 'Quest Stack' }],
  openGraph: {
    title: 'Mirarr - システムの真実を映し出す',
    description: 'ラーの鏡のようにバグを映し出す、完全無料のテスト自動化ツール',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mirarr - システムの真実を映し出す',
    description: 'ラーの鏡のようにバグを映し出す、完全無料のテスト自動化ツール',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
