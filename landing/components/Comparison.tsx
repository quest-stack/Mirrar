export default function Comparison() {
  const comparisons = [
    { feature: '操作方法', playwright: 'コードを書く', autoPailot: '画面で操作するだけ' },
    { feature: 'セレクター', playwright: '自分で指定', autoPailot: 'AIが自動で最適なものを選択' },
    { feature: 'エラー時', playwright: '止まる', autoPailot: 'AIツールで自動修復' },
    { feature: 'テスト作成', playwright: '1から書く', autoPailot: 'テンプレート選択で8割完成' },
    { feature: '結果', playwright: 'ログだけ', autoPailot: '動画+スクショ+改善提案' },
    { feature: '学習コスト', playwright: '数日〜数週間', autoPailot: '10分' },
    { feature: 'コスト', playwright: '無料', autoPailot: '無料' },
  ]

  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Playwrightとの<span className="gradient-text">違い</span>
          </h2>
          <p className="text-xl text-gray-600">
            Playwrightが難しかった方でも、Auto Pailotなら簡単に使えます
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="grid grid-cols-3 bg-gradient-to-r from-primary-600 to-blue-600 text-white font-bold">
              <div className="p-4 text-center">項目</div>
              <div className="p-4 text-center border-l border-primary-400">Playwright</div>
              <div className="p-4 text-center border-l border-primary-400">Auto Pailot</div>
            </div>

            {/* Rows */}
            {comparisons.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } hover:bg-primary-50 transition-colors duration-200`}
              >
                <div className="p-4 font-semibold text-gray-900 border-t border-gray-200">
                  {item.feature}
                </div>
                <div className="p-4 text-gray-600 border-t border-l border-gray-200 text-center">
                  {item.playwright}
                </div>
                <div className="p-4 text-primary-700 font-semibold border-t border-l border-gray-200 text-center">
                  ✨ {item.autoPailot}
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-900">
              <span className="font-bold">💡 注意:</span> PlaywrightとAuto Pailotは、どちらも優れたツールです。
              Playwrightはエンジニア向けの強力なツールですが、Auto Pailotは<span className="font-semibold">非エンジニアでも使えるように設計</span>されています。
              プログラミングができる方は、用途に応じて使い分けることをおすすめします。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
