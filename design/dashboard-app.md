# glspinner開発用ダッシュボードアプリ

**ステータス**: 提案（未実装）
**対象**: `devtools/dashboard/`（新規、`src/`/`examples/`とは無関係）。ルート`tsconfig.json`/`package.json`/`.gitignore`にも軽微な追記あり

## Context（なぜこの変更をするか）

glspinner開発時、VSCode（コーディング）・Chrome（WebGLプレビュー確認）・Notion（タスク／振り返り／技術課題の管理）・Claudeアプリ・検索用Chromeと同時に開く画面が多く、作業効率を圧迫している。Chromeのタブ切り替えでの解決（全部を1つのブラウザに寄せる）は操作が煩雑になるため不採用という制約のもと、段階的に検討した:

1. **VSCode一本化**（組み込み`Simple Browser`でのWebGLプレビュー代替＋組み込みChromeデバッガでのDevTools代替）を検討したが、Notionだけは「本物のNotionをそのままSimple Browserで埋め込めるか」が未検証のまま残った（NotionはSPAとして重く、ドラッグ操作等が崩れるリスクがある）
2. **VSCode拡張の自作**も検討したが、`Webview`⇄`Extension Host`間のpostMessageプロトコルや`contributes`定義など、VSCode拡張API固有の作法を新たに学ぶコストが必要になることが判明した
3. 最終的に「**普通のWeb appとして作り、VSCode組み込みのSimple Browserタブに載せる**」方針で合意した。拡張APIを学ばずに済み、かつ「本物のNotionを埋め込む」のではなく「必要な情報だけを描画する専用UI」を自分たちで作ることで、埋め込みの不確実性そのものを回避できる

このダッシュボードの役割は**Notion窓の代替に限定**する。WebGLプレビューは別途VSCode組み込みのChromeデバッガ（`launch.json`の`type: "chrome"`）で対応し、Claude Codeとのやり取りは別途VSCode内のターミナル/拡張で対応する——どちらもこのダッシュボードの担当範囲外という前提が既にある。またタスク・振り返り・技術課題の**新規作成・登録は行わない**。それは既存の`glspinner-notion-tasks`/`glspinner-retro`スキル（Claude Codeとのチャット経由）に任せ、ダッシュボードは「一覧で眺める」「タスクのステータスをその場で変える」という閲覧・軽微操作のみに絞る。

## 決定事項（会話で合意済み）

| 論点 | 決定 |
|---|---|
| 配置 | glspinnerリポジトリ内、`src/`/`examples/`とは別の新規ルート直下フォルダ`devtools/dashboard/`（新規リポジトリは作らない——同一VSCodeウィンドウに自動的に含まれることを優先） |
| v1スコープ | 📐 glspinner改良タスク／📝 振り返り／🔧 技術課題の3 Notion DBをタブで横断表示。作成・編集はタスクのStatus変更のみ |
| 技術スタック | プレーンTypeScript（フレームワーク無し、glspinner本体の作風に合わせる）＋ Vite |
| Notion中継 | 別プロセスを立てず、Viteプラグインの`configureServer`フックでdev server自体に`/api/notion/*`ルートを追加する1プロセス構成 |
| 日常利用 | VSCode組み込み`Simple Browser`（`Simple Browser: Show` → `http://localhost:<port>`）で開き、別ウィンドウを増やさない |
| ライブラリ出力からの分離 | `dist/spinnergl-lib.*.js`に一切含まれないこと。実行時フラグでの無効化（デバッグモード的な扱い）ではなく、ビルドの入口から到達不能な構造にする |

## `.claude/CLAUDE.md`編集範囲制限との関係

`.claude/CLAUDE.md`の編集範囲制限は「glspinnerのライブラリ本体に関わるコード」（`src/webgl/shader/`と`src/app/`・`scene/`・`webgl/gl/`・`input/`・`math/`・`color/`・`tools/`配下のTS）に明示的に限定されており、目的は「ユーザー自身が実装することでWebGLライブラリの内容を理解している状態を保つ」ことにある。`devtools/dashboard/`はglspinnerのWebGLライブラリとは無関係な開発効率化ツールであり、この制限の対象外と判断する。**Claude Codeがこのフォルダ配下のコードを直接作成・編集してよい**という前提で設計している。

## 設計

### ディレクトリ構成

```
devtools/
  dashboard/
    package.json          # ルートのpackage.jsonとは独立（vite依存のみ）
    vite.config.ts        # notion-relayプラグインを組み込む
    tsconfig.json
    index.html
    .env.example           # NOTION_TOKEN / NOTION_DB_TASKS / NOTION_DB_RETRO / NOTION_DB_ISSUES
    .gitignore              # .env と node_modules を除外
    src/
      main.ts               # タブ切り替えとエントリポイント
      api.ts                 # /api/notion/* を叩くfetchラッパー
      views/
        TaskView.ts          # Status別グルーピング表示 + Status変更
        RetroView.ts          # 直近N件、Notionページへのリンク
        IssueView.ts           # ステータス別一覧、Notionページへのリンク
      style.css
    server/
      notion-relay-plugin.ts # ViteプラグインとしてconfigureServerでルート定義
      notion-client.ts        # Notion REST APIへの薄いfetchラッパー
```

### Notion連携の前提（ユーザー側の準備が必要）

この中継サーバーは、Claude CodeセッションのNotion MCP接続（Claude.ai側のコネクタ）とは**別の資格情報**が必要。ユーザー側で以下を事前に行う:

1. [notion.so/my-integrations](https://www.notion.so/my-integrations)で新規Internal Integrationを作成し、トークンを取得
2. 対象の3DB（📐 glspinner改良タスク／📝 振り返り／🔧 技術課題）をそのIntegrationと共有（Notion UI上の「Connections」から追加）
3. トークンとDB IDを`devtools/dashboard/.env`に設定（DB IDは`~/.claude/notion-databases.json`の`glspinner_task`/`tech_retro`/`tech_issue`エントリが参考になるが、資格情報自体は別物なので独立して設定する）

この準備が完了するまで実際の動作確認はできない。

### `server/notion-relay-plugin.ts`（Viteプラグイン）

`configureServer(server)`フックで`server.middlewares.use(...)`により以下のルートを追加する（Express等は追加せず、Node組み込みの`http`ハンドラ形式で素朴に実装）:

- `GET /api/notion/tasks` — `NOTION_DB_TASKS`をクエリし`{id, name, status, order}[]`を返す
- `PATCH /api/notion/tasks/:pageId` — body `{status}` を受け取り、該当ページの`Status`プロパティ（Notionの`status`型プロパティ）を更新する
- `GET /api/notion/retro` — `NOTION_DB_RETRO`を`プロジェクト=glspinner`でフィルタし、直近作成順で`{id, name, url, createdTime}[]`を返す（上限20件程度）
- `GET /api/notion/issues` — `NOTION_DB_ISSUES`を`プロジェクト=glspinner`でフィルタし`{id, name, status, url}[]`を返す

**実装時の注意**: Notion APIのデータベースクエリ用エンドポイント（`/v1/databases/{id}/query`か、データソースAPI形式の`/v1/data_sources/{id}/query`か）と`Notion-Version`ヘッダーの値は、実装着手時に公式ドキュメントで現行の推奨形式を確認してから実装する（このドキュメントでは決め打ちしない）。

### `server/notion-client.ts`

`NOTION_TOKEN`をヘッダーに載せてNotion APIを叩く薄い関数群（`queryDatabase(dbId, filter?)`, `updatePageStatus(pageId, statusName)`）。トークンはサーバー側（Viteプラグイン内、Node実行環境）でのみ保持し、フロントエンドのバンドルには一切含めない（`import.meta.env`ではなく`process.env`側で読む）。

### フロントエンド（`src/`）

- タブ切り替えのみの最小UI（フレームワーク無し、`document.createElement`ベースの素朴な描画関数）。タブ: `タスク` / `振り返り` / `技術課題`
- 各ビューはタブがアクティブになったタイミングでfetchし、簡単なリストとして描画する。自動ポーリングはせず、各ビューに「更新」ボタンを置く手動更新方式（個人用の閲覧ツールなので複雑な同期は不要）
- `TaskView`のみ、各行に`<select>`でStatus変更UIを持つ。変更時に`PATCH /api/notion/tasks/:pageId`を呼び、成功したら一覧を再描画する

### スコープ外（今回は作らない）

- タスク・振り返り・技術課題の新規作成/登録（`glspinner-notion-tasks`/`glspinner-retro`にチャットで任せる）
- WebGLプレビュー機能（別途VSCode組み込みChromeデバッガで対応、対象外）
- 自動リフレッシュ・通知・複数ユーザー対応
- `devtools/dashboard`自体のJestテスト（個人用の小規模ツールのため手動確認で十分と判断。必要になれば別途検討）

## ライブラリ出力からの分離

`devtools/dashboard/`はglspinnerを`dist/spinnergl-lib.*.js`としてライブラリ出力する際に**含まれてはならない**（実行時フラグで無効化する「デバッグモード」的な扱いではなく、そもそもビルドの入口から到達できない構造にする）。除外によってビルド・ライブラリ本体にエラーが出ないことも要件。

実際に`tsconfig.json`/`vite.config.ts`/`.gitignore`を確認した結果、以下がすでに成立している:

- ルートの`tsconfig.json`は`"include": ["src"]`のみで、`devtools/`配下は最初から型チェック対象外
- `vite.config.ts`（コアビルド）のエントリは`src/index.ts`のみ、`vite.tools.config.ts`（tools側ビルド）のエントリは`src/tools.ts`のみ。Viteのlibビルドはエントリから辿れるimportしかバンドルしないため、`src/index.ts`/`src/tools.ts`のどちらも`devtools/dashboard/`を一切importしない設計である限り、**`dist/`側に混入することは構造的にあり得ない**
- ルートの`.gitignore`の`node_modules/`はスラッシュ始まりでない（＝深さを問わず一致する）ため、`devtools/dashboard/node_modules/`も既存の1行だけで既にカバーされる

つまり「デバッグモードのフラグで分岐して除外する」より安全な状態（除外すべきコードパス自体が存在しない）が、`devtools/dashboard/`を`src/`の外に置くという配置だけで既に成立している。既存コードの改変は不要。

その上で、念のための多重防御として以下を追加する:

- ルート`tsconfig.json`に`"exclude": ["devtools"]`を明記する（`include`だけに依存せず意図を明文化）
- ルート`package.json`に`files`フィールド（`["dist", "README.md", "LICENSE"]`程度）を追加する、または`.npmignore`を新設し`devtools/`を明記する。README記載の配布形態は`npm install github:SpinnerEddy/glspinner#main`というgit直接参照であり、git参照インストール時にnpmが`files`/`.npmignore`をどこまで厳密に尊重するかは実装時に実際の挙動を確認してから決める（憶測で断定しない）。最低限、コンシューマーの`node_modules/glspinner/`配下に`devtools/`の中身（Notion中継用の秘匿情報を扱うコードを含む）が余計にコピーされる事態は避けたい
- ルートの`.gitignore`に`devtools/dashboard/.env`を追記する（既存の`.gitignore`には`.env`パターンが無いため新規追加が必要）

これにより「除外＝エラーが起きない」も自動的に満たされる。`src/`側のどのファイルも`devtools/dashboard/`を参照しないため、`devtools/dashboard/`ごとフォルダを削除してもコアライブラリのビルド・動作は一切変わらない。

## 変更対象ファイル

**新規**
- `devtools/dashboard/`配下、上記ディレクトリ構成の全ファイル（package.json, vite.config.ts, tsconfig.json, index.html, .env.example, .gitignore, src/4ファイル, server/2ファイル）

**更新**
- リポジトリルートの`.gitignore`に`devtools/dashboard/.env`を追記
- リポジトリルートの`tsconfig.json`に`"exclude": ["devtools"]`を追記
- リポジトリルートの`package.json`に`files`フィールドを追加、または`.npmignore`を新設して`devtools/`を明記（git参照インストール時の実際の挙動を確認してから判断）

## 実装順序

1. `devtools/dashboard/`の雛形作成（package.json, vite.config.ts, tsconfig.json, index.html, `.env.example`）
2. `server/notion-client.ts` — Notion APIクエリ・更新の薄いラッパー（この時点でAPI仕様を確認）
3. `server/notion-relay-plugin.ts` — 4ルートの実装
4. `src/api.ts` + `src/views/`3ファイル + `src/main.ts` — フロントエンド
5. ルート側の分離設定（`.gitignore`/`tsconfig.json`の`exclude`/`package.json`の`files`または`.npmignore`）
6. ユーザーに`.env`設定（Notion Integration作成・DB共有・トークン/ID記入）を依頼
7. `npm run dev`（`devtools/dashboard`配下）を実Chromeで開いて動作確認（3タブのデータ表示、Status変更の反映）
8. 問題なければVSCodeの`Simple Browser: Show`で同じURLを開き、日常利用に切り替える

## 検証方法

- **実データ確認**: `.env`設定後に`npm run dev`し、3タブそれぞれで実際のNotionデータが表示されること
- **Status変更**: タスクの`<select>`でStatusを変更し、実Notion側で反映されていることを確認
- **Simple Browser動作確認**: VSCodeの`Simple Browser: Show`で同URLを開き、実Chromeと同様に表示・操作できること（WebSocket/HMRが必要ならその動作も含む）
- **トークン漏洩の確認**: 実Chromeの開発者ツールのNetworkタブで、`NOTION_TOKEN`がフロントエンド側のレスポンス・バンドルに含まれていないことを確認
- **ライブラリ出力からの分離確認**: `devtools/`ごと一時的にリネーム（または削除）した状態で`npm run build`が今まで通り成功し、`dist/spinnergl-lib.*.js`の内容（サイズ・grep）にdevtools側の文字列が含まれないことを確認する

## 実装分担についての注意

上記「`.claude/CLAUDE.md`編集範囲制限との関係」の判断により、`devtools/dashboard/`配下はClaude Codeが直接実装してよい。手順6（Notion Integration作成・DB共有・`.env`記入）のみ、Notion側のUI操作を伴うためユーザー側の作業になる。

## この提案の経緯

VSCode/Chrome/Notion/Claudeアプリ/検索用Chromeという画面過多の相談から出発し、「VSCode一本化」「VSCode拡張の自作」「独立したダッシュボードアプリ」の3方向を比較検討した。VSCode一本化はNotionの埋め込み信頼性が未検証のまま残り、VSCode拡張は新しいAPI習得コストが要ることが分かったため、両者の折衷案として「普通のWeb appとして作り、Simple Browserに載せる」方針に至った。さらに`glspinner-design`スキルでの設計相談を経て、v1スコープ（3DB横断表示＋タスクのStatus変更のみ）とNotion中継の構成（Vite 1プロセス）を決定した。加えて、glspinnerをライブラリとして配布する際にこのダッシュボードが混入しないようにしたいという要望を受け、実際の`tsconfig.json`/`vite.config.ts`/`.gitignore`を確認した上で、構造的に混入不可能であることを検証し、多重防御の追加策を設計へ組み込んだ。
