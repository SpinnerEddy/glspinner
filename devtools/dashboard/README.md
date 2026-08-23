# glspinner Dashboard

glspinner開発時のNotion（📐 glspinner改良タスク／📝 振り返り／🔧 技術課題）を一箇所で眺めるための開発補助ツール。glspinnerライブラリ本体（`src/`配下）とは無関係で、`dist/`のビルド出力にも含まれない（詳細は[`design/dashboard-app.md`](../../design/dashboard-app.md)参照）。

タスク・振り返り・技術課題の**新規作成・登録はここでは行わない**（Claude Codeとのチャット、`glspinner-notion-tasks`/`glspinner-retro`スキルに任せる）。ここでできるのは一覧の閲覧と、タスクのStatus変更のみ。

## セットアップ

1. [notion.so/my-integrations](https://www.notion.so/my-integrations)で新規Internal Integrationを作成し、トークンを取得する
2. 対象の3DB（📐 glspinner改良タスク／📝 振り返り／🔧 技術課題）をそのIntegrationと共有する（各DBページ右上の「Connections」から追加）
3. `.env.example`を`.env`にコピーし、トークンと各DBのdatabase_id（NotionのURLに含まれるUUID）を記入する
4. `npm install`
5. `npm run dev` → `http://localhost:5173`をブラウザで開く

## 日常利用

動作確認できたら、VSCodeのコマンドパレットから`Simple Browser: Show`を実行し、同じURLを開く。以後は別ウィンドウを増やさずVSCode内のタブとして使える。
