# glspinner Dashboard

glspinner開発時のNotion（📐 glspinner改良タスク／📝 振り返り／🔧 技術課題）を一箇所で眺めるための開発補助ツール。glspinnerライブラリ本体（`src/`配下）とは無関係で、`dist/`のビルド出力にも含まれない（詳細は[`design/dashboard-app.md`](../../design/dashboard-app.md)参照）。

タスク・振り返り・技術課題の**新規作成・登録はここでは行わない**（Claude Codeとのチャット、`glspinner-notion-tasks`/`glspinner-retro`スキルに任せる）。ここでできるのは一覧の閲覧と、タスクのStatus変更のみ。

## 初回セットアップ

1. [notion.so/my-integrations](https://www.notion.so/my-integrations)で新規Internal Integrationを作成し、トークンを取得する
2. 対象の3DB（📐 glspinner改良タスク／📝 振り返り／🔧 技術課題）をそのIntegrationと共有する（各DBページ右上の「Connections」から追加）
3. `.env.example`を`.env`にコピーし、トークンと各DBのdatabase_id（NotionのURLに含まれるUUID）を記入する

（`npm install`は次の起動方法のどちらでも自動的に行われるので、手動で実行しなくてよい）

## 起動方法

3通りある。上ほど手間が少ない。

### 1. フォルダを開くだけで自動起動（推奨）

リポジトリルートに`.vscode/tasks.json`を用意してあり、VSCodeでこのリポジトリのフォルダを開くと自動的に`npm run dev:all`が実行される（`runOptions.runOn: "folderOpen"`）。初回だけVSCodeが「このワークスペースにはフォルダを開いたときに自動実行されるタスクがあります。許可しますか？」と確認してくるので許可する。以後はフォルダを開くたびに自動で立ち上がる。ターミナルパネルに専用タブ（`glspinner: start dev...`）が出るので、そこで進行状況を確認できる。

### 2. ダブルクリックで起動

- **Windows**: `devtools/dashboard/start.cmd`をダブルクリック
- **Mac**: `devtools/dashboard/start.command`をダブルクリック（Finderからダブルクリックできるよう実行権限をgit管理下で付与済み。もし権限が外れていたら`chmod +x start.command`を一度実行する）

どちらも初回は自動で`npm install`が走り、`.env`が無ければその場で教えてくれる。終了するにはそのウィンドウで`Ctrl+C`。

### 3. ターミナルから起動

このフォルダ（`devtools/dashboard`）で:

```
npm run dev:all
```

これでglspinner本体（port 2222）とdashboard（port 5173）が1コマンドで同時に立ち上がる（`concurrently`使用。ターミナル出力は`[glspinner]`/`[dashboard]`のプレフィックスで色分けされる）。

dashboardだけを起動したい場合（Notion側の作業のみで、WebGLプレビューは別途本体側を自分で起動する場合）は`npm run dev`。

**`localhost`ではなく`127.0.0.1`を使うこと。** 環境によって`localhost`がIPv6（`::1`)に解決され、Vite側は`127.0.0.1`（IPv4）にしか待ち受けていないため`localhost`だと接続拒否になることがある（`vite.config.ts`の`server.host`で明示的にIPv4固定している）。

## 日常利用

VSCodeのコマンドパレットから`Simple Browser: Show`を実行し、`http://127.0.0.1:5173`を開く。以後は別ウィンドウを増やさずVSCode内のタブとして使える。

### Simple Browserを開く操作もショートカット化する（任意）

`simpleBrowser.show`コマンドはURLを引数で受け取れるので、キーボードショートカット1つに割り当てられる。ただしこれはVSCodeの個人設定（`keybindings.json`）に入るため、リポジトリには含められず各自1回だけ設定する必要がある:

1. コマンドパレットで「基本設定: キーボード ショートカットを開く (JSON)」（Preferences: Open Keyboard Shortcuts (JSON)）を実行
2. 以下を追記:

```json
{
    "key": "alt+shift+b",
    "command": "simpleBrowser.show",
    "args": "http://127.0.0.1:5173"
}
```

これで`Alt+Shift+B`一発でダッシュボードがSimple Browserタブとして開く（キーの割り当ては好みに変えてよい）。
