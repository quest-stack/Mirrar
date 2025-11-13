export default function Hero() {
  return (
    <section className="section pt-20 pb-16">
      <div className="container-custom">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-8">
            <span className="text-sm font-semibold text-primary-700">
              🎉 完全無料 | APIコスト0円
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">非エンジニア</span>でも使える
            <br />
            テスト自動化ツール
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
            コード不要。テンプレートを選んで10分でテスト完成。
            <br />
            <span className="font-semibold text-primary-600">Vibe Coding</span>（Claude Code、Cursor、Windsurf）対応
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href="https://github.com/quest-stack/auto_pailot_tester/releases"
              className="btn-primary text-lg px-8 py-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              📥 無料ダウンロード
            </a>
            <a
              href="#how-it-works"
              className="btn-secondary text-lg px-8 py-4"
            >
              使い方を見る
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-gray-200">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">0円</div>
              <div className="text-sm text-gray-600">完全無料</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">10分</div>
              <div className="text-sm text-gray-600">テスト作成</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">0行</div>
              <div className="text-sm text-gray-600">コード不要</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
