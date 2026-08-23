# devtools/dashboard — 開発補助ダッシュボード

`docs/`配下の他ドキュメントは`src/`（glspinnerライブラリ本体）の実装スナップショットを扱うが、このファイルだけは性質が異なる。`devtools/dashboard/`はglspinnerライブラリとは無関係な**開発効率化ツール**（`dist/`のビルド出力にも一切含まれない）で、ここではその使い方をまとめる。設計の経緯・決定事項は[`design/dashboard-app.md`](../../design/dashboard-app.md)、コマンドの一次情報源は[`devtools/dashboard/README.md`](../../devtools/dashboard/README.md)。

## 何のためのツールか

glspinner開発時、VSCode（コーディング）・Chrome（WebGLプレビュー確認）・Notion（タスク/振り返り/技術課題管理）・検索用ブラウザと画面が多くなりがちだった。このダッシュボードは「VSCode 1ウィンドウに寄せる」という方針のもとで作られた、Notion閲覧＋WebGLプレビュー確認をまとめるツール。VSCode組み込みの`Simple Browser`タブとして開くことで、別ウィンドウを増やさずに使える。

## 全体構成

ブラウザ画面は左右2ペイン。

```
┌─────────────────────┬──────────────────────────┐
│ プレビュー(iframe)    │  glspinner Dashboard       │
│  glspinner本体(2222) │  [タスク][振り返り][技術課題] │
├─────────────────────┤  ─────────────────────────  │
│ ログパネル            │  一覧（スクロール）           │
│  console/error       │  ─────────────────────────  │
│                     │  詳細（Markdown表示）        │
└─────────────────────┴──────────────────────────┘
```

- **左**: `examples/index.html`（glspinner本体、port 2222）を`<iframe>`で埋め込み。同ページに仕込んだconsole/エラー転送スクリプトが`postMessage`でログをダッシュボードへ送り、下のログパネルに表示する
- **右**: Notionの3DB（📐 glspinner改良タスク／📝 振り返り／🔧 技術課題）をタブで閲覧。一覧行クリックでNotionページ本文をMarkdown表示、行右端の🔗ボタンでリンクをコピー

## ディレクトリ構成

```
devtools/dashboard/
    package.json / vite.config.ts / tsconfig.json
    start.cmd / start.command     起動用（Windows/Mac）
    .env / .env.example            Notionトークン・DB ID・プレビューURL
    src/
        main.ts                    左右ペインの組み立て
        views/
            PreviewPane.ts          左ペイン（iframe + ログ受信）
            ListDetailView.ts       右ペイン共通の「一覧+詳細」コンポーネント
            TaskView.ts / RetroView.ts / IssueView.ts  各タブの薄いラッパー
        api.ts                     /api/notion/* を叩くfetchラッパー
    server/
        notion-relay-plugin.ts     Viteプラグイン。/api/notion/* ルートを追加
        notion-client.ts           Notion REST APIへの薄いラッパー
```

## アーキテクチャ上の要点

- **glspinnerリポジトリ内の別フォルダ**（`src/`/`examples/`とは無関係）。`.claude/CLAUDE.md`のコード編集範囲制限（ライブラリ本体学習目的の制約）はこのフォルダには及ばない
- **ライブラリ出力から構造的に分離されている**: ルート`tsconfig.json`の`include: ["src"]`＋`exclude: ["devtools"]`、`vite.config.ts`/`vite.tools.config.ts`のエントリが`src/index.ts`/`src/tools.ts`のみであることにより、`devtools/`配下のコードは`dist/spinnergl-lib.*.js`に混入しえない（実際に`npm run build`後の`dist/*.js`をgrepして無関係な文字列が含まれないことを確認済み）
- **Notion中継はVite プラグインの`configureServer`フックで1プロセスに同居**（別Node/Expressサーバーは立てない）。`server/notion-relay-plugin.ts`が`/api/notion/tasks`・`/api/notion/retro`・`/api/notion/issues`・`/api/notion/pages/:id/content`を提供し、`server/notion-client.ts`がNotion API（2025-09-03版、`data_sources`経由のクエリ）を薄くラップする
- **select/status型プロパティの更新は選択肢の事前検証を必須にしている**（`notion-client.ts`の`findOptionId`）。Notionは未知の名前を渡すと新しい選択肢を無言で作ってしまうため、既存の選択肢一覧と照合し一致しなければエラーで止める（開発中に実際にこの事故を起こして学んだ教訓が反映されている）

## 起動方法

3通りある（詳細は[`devtools/dashboard/README.md`](../../devtools/dashboard/README.md)）:

1. **フォルダを開くだけで自動起動**: リポジトリルートの`.vscode/tasks.json`（`runOptions.runOn: "folderOpen"`）により、VSCodeでこのリポジトリを開くと`npm run dev:all`が自動実行される（初回のみ許可プロンプト）
2. **ダブルクリック**: Windowsは`devtools/dashboard/start.cmd`、Macは`devtools/dashboard/start.command`
3. **ターミナル**: `devtools/dashboard`で`npm run dev:all`（`concurrently`でglspinner本体・ダッシュボード両方を1コマンド起動）

起動後、VSCodeのコマンドパレットから`Simple Browser: Show` → `http://127.0.0.1:5173`を開く。

**注意**: `localhost`ではなく`127.0.0.1`を使うこと。環境によって`localhost`がIPv6（`::1`）に解決され、Vite側は`server.host: '127.0.0.1'`でIPv4にしか待ち受けていないため`localhost`だと接続拒否になることがある。

## 初回セットアップ（Notion連携）

1. [notion.so/my-integrations](https://www.notion.so/my-integrations)で新規Internal Integrationを作成しトークンを取得（このセッションが使うNotion MCP接続とは別の資格情報が必要）
2. 対象の3DBをそのIntegrationと共有
3. `.env.example`を`.env`にコピーし、トークン・DB ID・（必要なら）プレビューURLを記入

## できること・できないこと

- タスク・振り返り・技術課題の**一覧閲覧**、Markdownでの**詳細表示**、Notionリンクの**コピー**
- **タスクと技術課題のみステータス変更可**（タスク: 未着手/進行中/完了、技術課題: 未解決/調査中/解決済み）。振り返りDBには対応するプロパティが無いため未対応
- **新規作成・登録は行わない**。タスク登録は`glspinner-notion-tasks`スキル、振り返り記録は`glspinner-retro`スキルにチャットで任せる設計
- 左のプレビュー・ログパネルは`console.log`/`console.error`等のテキストを拾うだけの軽量なもの。ブレークポイントを張った本格デバッグにはVSCode組み込みのChromeデバッガや実Chromeでの起動が別途必要

## 変更履歴

- 2026-08: 初版。Notion 3DB閲覧＋glspinnerプレビュー/ログパネルの2ペイン構成として実装。
