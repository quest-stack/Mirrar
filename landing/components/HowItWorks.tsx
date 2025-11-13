export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'テンプレートを選択',
      description: 'ログイン、フォーム送信、商品購入など、やりたいテストのテンプレートを選びます。',
      detail: '用意されている5つのテンプレートから選ぶだけ。カスタムテストも作成可能。'
    },
    {
      number: '2',
      title: 'URLと要素を設定',
      description: 'テストしたいページのURLを入力し、ガイドに従って要素を選択します。',
      detail: '要素は自動検出されるので、クリックするだけ。セレクターの知識は不要。'
    },
    {
      number: '3',
      title: 'テストデータを入力',
      description: 'テスト用のメールアドレスやパスワードなどを入力します。',
      detail: 'ダミーデータを推奨。本番データの使用を防ぐセキュリティ機能付き。'
    },
    {
      number: '4',
      title: 'テストを実行',
      description: '「実行」ボタンをクリックするだけ。ブラウザが自動で操作されます。',
      detail: '動画録画とスクリーンショットで、実行内容を詳細に記録。'
    },
    {
      number: '5',
      title: '結果を確認',
      description: '各ステップの成功/失敗、実行動画、改善提案を確認できます。',
      detail: '問題があれば、AIツール（Claude Code等）に修正を依頼可能。'
    },
  ]

  return (
    <section id="how-it-works" className="section bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">10分</span>で始められる
          </h2>
          <p className="text-xl text-gray-600">
            難しい設定は一切なし。今すぐテスト自動化を始めましょう
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative mb-12 last:mb-0"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-20 w-0.5 h-full bg-gradient-to-b from-primary-400 to-primary-200 -z-10" />
              )}

              <div className="flex gap-6 items-start">
                {/* Number Badge */}
                <div className="flex-shrink-0 w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  {step.number}
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-700 mb-3">
                    {step.description}
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    💡 {step.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="https://github.com/quest-stack/auto_pailot_tester"
            className="btn-primary text-lg px-8 py-4 inline-block"
            target="_blank"
            rel="noopener noreferrer"
          >
            📚 詳しいガイドを見る
          </a>
        </div>
      </div>
    </section>
  )
}
