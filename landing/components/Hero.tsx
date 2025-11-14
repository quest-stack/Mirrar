export default function Hero() {
  return (
    <section className="section min-h-screen flex items-center bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container-custom text-center">
        {/* ロゴ・ブランド */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">
            <span className="gradient-text">Mirarr</span>
          </h1>
          <p className="text-sm md:text-base text-gray-500 tracking-widest">
            ミラー
          </p>
        </div>

        {/* メインキャッチ */}
        <h2 className="heading-lg mb-8 max-w-4xl mx-auto">
          システムの<span className="gradient-text">真実</span>を映し出す
        </h2>

        {/* サブキャッチ */}
        <p className="text-lead mb-16 max-w-3xl mx-auto">
          鏡のようにバグを映し出す<br />
          コード不要、完全無料のテスト自動化ツール
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
          <a
            href="https://github.com/quest-stack/Mirarr/releases"
            className="btn-primary text-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            無料ダウンロード
          </a>
          <a
            href="#features"
            className="btn-secondary text-lg"
          >
            詳しく見る
          </a>
        </div>

        {/* 対応プラットフォーム */}
        <div className="text-sm text-gray-500 space-y-3">
          <p className="font-medium">対応プラットフォーム</p>
          <div className="flex gap-8 justify-center items-center flex-wrap">
            <span className="flex items-center gap-2 hover:text-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M0 0h11.377v11.372H0zM12.623 0H24v11.372H12.623zM0 12.623h11.377V24H0zM12.623 12.623H24V24H12.623z"/>
              </svg>
              Windows
            </span>
            <span className="flex items-center gap-2 hover:text-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
              </svg>
              macOS
            </span>
            <span className="flex items-center gap-2 hover:text-gray-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.49 3.49-1.588 2.046-4.097 2.432-4.097 4.742 0 4.963 9.243 10.425 9.243 10.425s9.244-5.462 9.244-10.425c0-2.31-2.51-2.696-4.098-4.742-1.19-1.537-1.414-2.398-1.49-3.49-.064-1.491 1.056-5.965-3.17-6.298-.165-.013-.325-.021-.48-.021z"/>
              </svg>
              Linux
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
