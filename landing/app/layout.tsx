import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mirarr - システムの真実を映し出すテスト自動化ツール',
  description: 'システムの真実を映し出す、完全無料のテスト自動化ツール。コード不要、Vibe Coding対応。Claude Code、Cursor、Windsurf等のAIツールと連携可能。',
  keywords: ['Mirarr', 'ミラー', 'テスト自動化', 'ノーコード', 'Vibe Coding', 'AI', '無料', 'Electron', 'QA', 'テストツール'],
  authors: [{ name: '合同会社QUEST' }],
  openGraph: {
    title: 'Mirarr - システムの真実を映し出す',
    description: 'システムの真実を映し出す、完全無料のテスト自動化ツール',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mirarr - システムの真実を映し出す',
    description: 'システムの真実を映し出す、完全無料のテスト自動化ツール',
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
