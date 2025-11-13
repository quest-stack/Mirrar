export default function Features() {
  const features = [
    {
      icon: '📝',
      title: 'テンプレートで簡単',
      description: 'ログイン、フォーム送信、商品購入など、用意されたテンプレートを選ぶだけ。8割は自動で完成します。'
    },
    {
      icon: '🎯',
      title: 'コード不要',
      description: 'プログラミング知識は一切不要。画面を見ながら要素を選ぶだけで、テストが作成できます。'
    },
    {
      icon: '🤖',
      title: 'Vibe Coding対応',
      description: 'Claude Code、Cursor、Windsurf等のAIツールと連携。問題があれば、プロンプトをコピペして修正依頼。'
    },
    {
      icon: '💰',
      title: '完全無料',
      description: 'APIコスト0円。すべてローカルで動作するので、ランニングコストは一切かかりません。'
    },
    {
      icon: '🗣️',
      title: '自然言語対応',
      description: '「example.comを開いて、ログインボタンをクリック」と書くだけで、テストが自動生成されます。'
    },
    {
      icon: '📊',
      title: '詳細なレポート',
      description: '動画録画、スクリーンショット、改善提案付きの分かりやすい実行結果を表示します。'
    },
    {
      icon: '🔒',
      title: 'プライバシー重視',
      description: 'すべてのデータはローカル保存。外部サーバーへの送信は一切ありません。本番データの誤使用を防ぐ機能付き。'
    },
    {
      icon: '⚡',
      title: 'スマート検出',
      description: '5つの戦略で要素を自動検出。セレクターが変わっても、自動で最適なものを選択します。'
    },
  ]

  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Playwrightより<span className="gradient-text">簡単</span>
          </h2>
          <p className="text-xl text-gray-600">
            非エンジニアのために設計された、本当に使いやすいテスト自動化ツール
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 bg-white"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
