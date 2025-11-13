export default function CTA() {
  return (
    <section className="section bg-gradient-to-r from-primary-600 to-blue-600">
      <div className="container-custom">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            今すぐテスト自動化を始めよう
          </h2>
          <p className="text-xl mb-10 opacity-90">
            完全無料。インストールして、10分後にはテストが動き出します。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href="https://github.com/quest-stack/auto_pailot_tester/releases"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              target="_blank"
              rel="noopener noreferrer"
            >
              📥 無料ダウンロード
            </a>
            <a
              href="https://github.com/quest-stack/auto_pailot_tester"
              className="bg-transparent text-white px-8 py-4 rounded-lg font-bold text-lg border-2 border-white hover:bg-white hover:text-primary-600 transition-all duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              ⭐ GitHubで見る
            </a>
          </div>

          {/* Platform Support */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto text-center">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">🪟</div>
              <div className="font-semibold">Windows</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">🍎</div>
              <div className="font-semibold">macOS</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl mb-2">🐧</div>
              <div className="font-semibold">Linux</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
