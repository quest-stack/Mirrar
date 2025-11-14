export default function Comparison() {
  const comparisons = [
    { feature: '操作方法', playwright: 'コードを書く', mirarr: '画面で操作するだけ' },
    { feature: 'セレクター', playwright: '自分で指定', mirarr: '5戦略で自動検出' },
    { feature: 'エラー時', playwright: 'テストが停止', mirarr: 'AIツールで修復可能' },
    { feature: 'テスト作成', playwright: '1から記述', mirarr: 'テンプレート選択で8割完成' },
    { feature: '実行結果', playwright: 'ログのみ', mirarr: '動画・スクショ・改善提案' },
    { feature: '学習コスト', playwright: '数日〜数週間', mirarr: '10分' },
    { feature: 'コスト', playwright: '無料', mirarr: '無料' },
  ]

  return (
    <section id="comparison" className="section bg-gray-50">
      <div className="container-custom">
        {/* セクションヘッダー */}
        <div className="text-center mb-20">
          <h2 className="heading-lg mb-6">
            Playwrightとの<span className="gradient-text">違い</span>
          </h2>
          <p className="text-lead max-w-3xl mx-auto">
            Playwrightが難しかった方でも、Mirarr なら簡単に使えます
          </p>
        </div>

        {/* 比較表 */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* ヘッダー */}
            <div className="grid grid-cols-3 bg-gradient-to-r from-[#0F4C75] to-[#16213E] text-white">
              <div className="p-6 text-center font-bold">項目</div>
              <div className="p-6 text-center font-bold border-l border-white/20">Playwright</div>
              <div className="p-6 text-center font-bold border-l border-white/20">Mirarr</div>
            </div>

            {/* 比較行 */}
            {comparisons.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-blue-50/50 transition-colors`}
              >
                <div className="p-5 font-medium text-gray-900 border-t border-gray-200">
                  {item.feature}
                </div>
                <div className="p-5 text-gray-600 border-t border-l border-gray-200 text-center">
                  {item.playwright}
                </div>
                <div className="p-5 text-[#0F4C75] font-medium border-t border-l border-gray-200 text-center">
                  {item.mirarr}
                </div>
              </div>
            ))}
          </div>

          {/* 注意書き */}
          <div className="mt-10 p-6 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-gray-700 leading-relaxed">
              <span className="font-bold text-[#0F4C75]">注意:</span> PlaywrightとMirarrは、どちらも優れたツールです。
              Playwrightはエンジニア向けの強力なツールですが、Mirarr は<span className="font-semibold">非エンジニアでも使えるように設計</span>されています。
              プログラミングができる方は、用途に応じて使い分けることをおすすめします。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
