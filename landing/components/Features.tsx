export default function Features() {
  const features = [
    {
      title: 'テンプレートで簡単',
      description: 'ログイン、フォーム送信、商品購入など、用意されたテンプレートを選ぶだけ。8割は自動で完成します。'
    },
    {
      title: 'コード不要',
      description: 'プログラミング知識は一切不要。画面を見ながら要素を選ぶだけで、テストが作成できます。'
    },
    {
      title: 'Vibe Coding対応',
      description: 'Claude Code、Cursor、Windsurf等のAIツールと連携。問題があれば、プロンプトをコピペして修正依頼。'
    },
    {
      title: '完全無料',
      description: 'APIコスト0円。すべてローカルで動作するので、ランニングコストは一切かかりません。'
    },
    {
      title: '自然言語対応',
      description: '「example.comを開いて、ログインボタンをクリック」と書くだけで、テストが自動生成されます。'
    },
    {
      title: 'スマート検出',
      description: '5つの戦略で要素を自動検出。セレクターが変わっても、自動で最適なものを選択します。'
    },
    {
      title: '詳細なレポート',
      description: '動画録画、スクリーンショット、改善提案付きの分かりやすい実行結果を表示します。'
    },
    {
      title: 'プライバシー重視',
      description: 'すべてのデータはローカル保存。外部サーバーへの送信は一切ありません。本番データの誤使用を防ぐ機能付き。'
    },
  ]

  return (
    <section id="features" className="section bg-gray-50">
      <div className="container-custom">
        {/* セクションヘッダー */}
        <div className="text-center mb-20">
          <h2 className="heading-lg mb-6">
            コード不要で<span className="gradient-text">簡単</span>
          </h2>
          <p className="text-lead max-w-3xl mx-auto">
            非エンジニアのために設計された、本当に使いやすいテスト自動化ツール
          </p>
        </div>

        {/* 機能カードグリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card group"
            >
              {/* 装飾的なトップバー */}
              <div className="w-12 h-1 bg-gradient-to-r from-[#0F4C75] to-[#16213E] mb-6 rounded-full group-hover:w-16 transition-all duration-300"></div>

              <h3 className="heading-sm mb-4 text-gray-900">
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
