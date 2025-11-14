export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'インストール & テンプレート選択',
      description: 'GitHubからダウンロードして起動。ログイン、フォーム送信など、用意されたテンプレートを選ぶだけ。',
      highlight: 'プログラミング知識不要'
    },
    {
      number: '02',
      title: '設定 & 実行',
      description: 'URLと要素を選択し、テストデータを入力。「実行」ボタンを押せば、ブラウザが自動で操作されます。',
      highlight: 'セレクター自動検出'
    },
    {
      number: '03',
      title: '結果確認 & AI連携',
      description: '動画やスクリーンショットで結果を確認。問題があれば、Claude CodeやCursor等のAIツールに修正を依頼。',
      highlight: 'Vibe Coding対応'
    },
  ]

  return (
    <section id="how-it-works" className="section bg-white">
      <div className="container-custom">
        {/* セクションヘッダー */}
        <div className="text-center mb-20">
          <h2 className="heading-lg mb-6">
            <span className="gradient-text">10分</span>で始められる
          </h2>
          <p className="text-lead max-w-3xl mx-auto">
            難しい設定は一切なし。今すぐテスト自動化を始めましょう
          </p>
        </div>

        {/* ステップ */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative group"
              >
                {/* ステップカード */}
                <div className="card h-full flex flex-col">
                  {/* ステップ番号 */}
                  <div className="text-6xl font-black text-gray-100 mb-6 group-hover:text-gray-200 transition-colors">
                    {step.number}
                  </div>

                  {/* タイトル */}
                  <h3 className="heading-sm mb-4 text-gray-900">
                    {step.title}
                  </h3>

                  {/* 説明 */}
                  <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                    {step.description}
                  </p>

                  {/* ハイライト */}
                  <div className="inline-block">
                    <span className="text-sm font-medium text-[#0F4C75] bg-blue-50 px-3 py-1 rounded-full">
                      {step.highlight}
                    </span>
                  </div>
                </div>

                {/* 矢印（最後のステップ以外） */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <a
            href="https://github.com/quest-stack/auto_pailot_tester/releases"
            className="btn-primary text-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            今すぐダウンロード
          </a>
        </div>
      </div>
    </section>
  )
}
