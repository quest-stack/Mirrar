export default function CTA() {
  return (
    <section className="section bg-gradient-to-r from-[#0F4C75] to-[#16213E] relative overflow-hidden">
      {/* 装飾的な背景 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center text-white max-w-4xl mx-auto">
          {/* ヘッドライン */}
          <h2 className="heading-lg mb-8 text-white">
            今すぐテスト自動化を始めよう
          </h2>

          <p className="text-xl md:text-2xl mb-12 opacity-95 leading-relaxed">
            完全無料。インストールして、10分後にはテストが動き出します。
          </p>

          {/* CTAボタン */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <a
              href="https://github.com/quest-stack/auto_pailot_tester/releases"
              className="bg-white text-[#0F4C75] px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 inline-block"
              target="_blank"
              rel="noopener noreferrer"
            >
              無料ダウンロード
            </a>
            <a
              href="https://github.com/quest-stack/auto_pailot_tester"
              className="bg-transparent text-white px-10 py-5 rounded-full font-bold text-lg border-2 border-white hover:bg-white hover:text-[#0F4C75] transition-all duration-300 inline-block"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHubで見る
            </a>
          </div>

          {/* 追加情報 */}
          <div className="text-sm opacity-90">
            <p>Windows・macOS・Linux 対応 | APIコスト0円 | オープンソース</p>
          </div>
        </div>
      </div>
    </section>
  )
}
