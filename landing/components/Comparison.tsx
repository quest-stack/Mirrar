export default function Comparison() {
  const comparisons = [
    { feature: '操作方法', codeBased: 'コードを書く', mirarr: '画面で操作するだけ' },
    { feature: 'セレクター指定', codeBased: '自分で記述', mirarr: '5戦略で自動検出' },
    { feature: 'エラー時', codeBased: 'テストが停止', mirarr: 'AIツールで修復可能' },
    { feature: 'テスト作成', codeBased: '1から記述', mirarr: 'テンプレート選択で8割完成' },
    { feature: '実行結果', codeBased: 'ログ・レポート', mirarr: '動画・スクショ・改善提案' },
    { feature: '学習コスト', codeBased: '数日〜数週間', mirarr: '10分' },
  ]

  return (
    <section id="comparison" className="section bg-gray-50">
      <div className="container-custom">
        {/* セクションヘッダー */}
        <div className="text-center mb-20">
          <h2 className="heading-lg mb-6">
            既存ツールとの<span className="gradient-text">違い</span>
          </h2>
          <p className="text-lead max-w-3xl mx-auto">
            コードベースのツールが難しかった方でも、Mirrar なら簡単に使えます
          </p>
        </div>

        {/* 比較表 */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* ヘッダー */}
            <div className="grid grid-cols-2 bg-gradient-to-r from-[#0F4C75] to-[#16213E] text-white">
              <div className="p-6 text-center font-bold">コードベースのツール</div>
              <div className="p-6 text-center font-bold border-l border-white/20">Mirrar</div>
            </div>

            {/* 比較行 */}
            {comparisons.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-2 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } hover:bg-blue-50/50 transition-colors`}
              >
                <div className="p-6 border-t border-gray-200">
                  <div className="text-sm text-gray-500 mb-2">{item.feature}</div>
                  <div className="text-gray-700">{item.codeBased}</div>
                </div>
                <div className="p-6 border-t border-l border-gray-200">
                  <div className="text-sm text-gray-500 mb-2">{item.feature}</div>
                  <div className="text-[#0F4C75] font-medium">{item.mirarr}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 注意書き */}
          <div className="mt-10 p-6 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-gray-700 leading-relaxed">
              <span className="font-bold text-[#0F4C75]">補足:</span> コードベースのテストツール（Playwright、Puppeteer等）は、エンジニア向けの強力で優れたツールです。
              Mirrar は、それらとは異なるアプローチで<span className="font-semibold">非エンジニアでもVibe Codingで使える</span>ように設計されています。
              プログラミングスキルや用途に応じて、最適なツールをお選びください。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
