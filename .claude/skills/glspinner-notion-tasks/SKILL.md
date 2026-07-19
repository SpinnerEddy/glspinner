---
name: glspinner-notion-tasks
description: glspinner-ideationで発想したアイディア（または直近の会話ですでに出ているアイディア）をユーザーに選んでもらい、選択されたものだけをNotionの「glspinner改良タスク」データベースにタスクとして登録する。「このアイディアをタスクにして」「Notionに登録して」「ideationの結果をタスク化して」「アイディアを外部ツールに落として」といった、発想結果を実際のタスク管理に落とし込みたい依頼が来たら必ずこのスキルを使う。アイディアを発想すること自体はglspinner-ideation（内部的には`/glspinner-ideas`command）の仕事なので、発想だけが目的ならそちらを案内する。Notion以外の外部ツールへのタスク化は現状スコープ外。
---

# glspinner-notion-tasks

## このスキルの立ち位置

`glspinner-ideation`が「アイディアを出す」ところまでを担当するのに対し、このスキルは「出したアイディアのうち実際にやりたいものをNotionのタスクとして残す」ところを担当する。発想ロジックそのものは持たず、`glspinner-ideation`と共有の`.claude/commands/glspinner-ideas.md`を呼び出す。

Notion MCP（`mcp__claude_ai_Notion__*`ツール群）が接続済みであることが前提。未接続の場合はその旨をユーザーに伝えて中断する。

## 前提: 対象Notion DB

登録先DBの情報（data source ID・プロパティ定義・過去の変更履歴）は、SKILL.md本体にはベタ書きせず`~/.claude/glspinner/notion-databases.json`（**リポジトリの外**、ユーザーのホーム配下）の`databases["glspinner-tasks"]`エントリを一次情報源として参照する。このリポジトリはpublicのため、data source IDやページURLをコミットしたくないという理由でリポジトリ外に置いている。DBの切り替えが発生した場合はこの外部JSONファイルだけを更新すればよく、SKILL.mdの書き換えは不要（登録先が変わった旨をこのSKILL.mdへ都度追記しない）。リポジトリ側には構造だけを示すテンプレート`.claude/skills/notion-databases.example.json`を置いてある（実際のIDは含まない）。

`~/.claude/glspinner/notion-databases.json`が存在しない場合（新しい環境で初めて実行する場合など）は、`.claude/skills/notion-databases.example.json`をコピーして作成するようユーザーに促し、実際のdata source ID等を教えてもらってから埋める。

このJSONに記載のDBが見つからない・IDが変わっている等でアクセスできない場合は、決め打ちで別のDBに登録せず、`mcp__claude_ai_Notion__notion-search`でJSON内の`title`を検索し直し、候補をユーザーに確認してから進める。確認が取れたら`~/.claude/glspinner/notion-databases.json`の該当エントリも更新しておく（新しい設定を`history`に追記し、現行値を差し替える）。

## 実行手順

### 1. アイディアの用意

直前の会話ですでに`glspinner-ideation`（または`/glspinner-ideas`）の結果が出ている場合はそれをそのまま使う。出ていない場合は`/glspinner-ideas $ARGUMENTS`を実行してアイディアを新規に発想する（`$ARGUMENTS`もユーザー指定も無ければ、発想範囲をどうするか一言確認する）。

### 2. タスク化するアイディアをユーザーに選んでもらう

出揃ったアイディアを無条件に全部Notionへ登録しない。番号付きで一覧提示し、どれをタスク化するか（複数選択可）をユーザーに確認する。AskUserQuestionのmultiSelectを使うか、通常のチャットで確認するかは状況に応じてよいが、必ず選択のステップを挟むこと。

### 3. Notionページの作成

選ばれたアイディアごとに、`mcp__claude_ai_Notion__notion-create-pages`で以下の内容のページを作成する（複数選ばれた場合は`pages`配列にまとめて1回で作成してよい）:

- **parent**: `{"type": "data_source_id", "data_source_id": "<~/.claude/glspinner/notion-databases.jsonのdatabases[\"glspinner-tasks\"].dataSourceId>"}`
- **properties**: `~/.claude/glspinner/notion-databases.json`の`databases["glspinner-tasks"].properties`定義に従う。`titlePrefix`が設定されていればNameの前に付与する（現行設定では`null`のため付与しない）。`Status`は`defaultOnCreate`の値を使う。`Order`/`TODO参照`はそれぞれの`description`に従い、対応するTODO.mdが無ければ省略する。
- **content**（Notion Markdown本文）: `glspinner-ideas`が出したフォーマット（アイディア名／一言説明／既存アーキテクチャへの乗せ方／難易度目安）をほぼそのまま箇条書きで転記する。本文冒頭に「`glspinner`プロジェクトのideationから」の一言を添え、由来が分かるようにする。

`notion-create-pages`を呼ぶ前に、Notion Markdownの仕様（`notion://docs/enhanced-markdown-spec`）をまだ読んでいなければ一度確認しておくと安全（記法を推測で書かない）。

### 4. 結果の報告

作成した各ページのタイトルとURLを一覧でユーザーに報告する。選ばれなかったアイディアがあれば、それらは登録していない旨も一言添える。

## 完了後

登録したタスクのうち優先度の高いものがあれば、設計を詰めるなら`glspinner-design`、すぐ実装するなら`glspinner-implement`へ進めるとよいと案内する。

## 他SKILLとの関係

- `glspinner-ideation`: アイディア発想そのものの担当。発想だけで完結する依頼はこちらへ案内する。
- `glspinner-ideas`（command）: 実際の発想ロジック本体。両SKILLから共通で呼ばれる。
