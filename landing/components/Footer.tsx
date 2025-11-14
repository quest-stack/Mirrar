export default function Footer() {
  return (
    <footer className="bg-[#1A1A2E] text-gray-300">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* ブランド */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-bold text-white mb-4">
              Mirarr
            </h3>
            <p className="text-sm text-gray-400 mb-1">
              ミラー
            </p>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              システムの真実を映し出す、完全無料のテスト自動化ツール。
              非エンジニアでも使えるシンプルな設計で、Vibe Coding対応。
            </p>
            <a
              href="https://github.com/quest-stack/Mirrar"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">GitHub</span>
            </a>
          </div>

          {/* リンク */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">リンク</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://github.com/quest-stack/Mirrar/releases" className="text-sm hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  ダウンロード
                </a>
              </li>
              <li>
                <a href="https://github.com/quest-stack/Mirrar/blob/HEAD/docs/USER_GUIDE.md" className="text-sm hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  ユーザーガイド
                </a>
              </li>
              <li>
                <a href="https://github.com/quest-stack/Mirrar/issues" className="text-sm hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  Issue報告
                </a>
              </li>
            </ul>
          </div>

          {/* リソース */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">リソース</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://github.com/quest-stack/Mirrar/blob/HEAD/docs/SECURITY.md" className="text-sm hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  セキュリティ
                </a>
              </li>
              <li>
                <a href="https://github.com/quest-stack/Mirrar/blob/HEAD/docs/DATABASE.md" className="text-sm hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  データベース
                </a>
              </li>
              <li>
                <a href="https://github.com/quest-stack/Mirrar/blob/HEAD/DESIGN.md" className="text-sm hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  設計書
                </a>
              </li>
              <li>
                <a href="https://github.com/quest-stack/Mirrar/blob/HEAD/LICENSE" className="text-sm hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  ライセンス
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* フッター下部 */}
        <div className="separator"></div>
        <div className="pt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2024 合同会社QUEST. MIT License.
          </p>
          <p className="text-xs text-gray-600 mt-2">
            Made for non-engineers
          </p>
        </div>
      </div>
    </footer>
  )
}
