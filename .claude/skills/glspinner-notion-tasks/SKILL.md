---
name: glspinner-notion-tasks
description: glspinner-ideationで発想したアイディア（または直近の会話ですでに出ているアイディア）をユーザーに選んでもらい、選択されたものだけをNotionの「glspinner改良タスク」データベースにタスクとして登録する。既存の大きな設計ドキュメント・タスクページを実装手順単位に分割してタスク化したい場合もこのスキルの対象。「このアイディアをタスクにして」「Notionに登録して」「ideationの結果をタスク化して」「アイディアを外部ツールに落として」「この内容を手順単位で分割してタスク化して」といった、発想結果や既存ドキュメントを実際のタスク管理に落とし込みたい依頼が来たら必ずこのスキルを使う。アイディアを発想すること自体はglspinner-ideation（内部的には`/glspinner-ideas`command）の仕事なので、発想だけが目的ならそちらを案内する。Notion以外の外部ツールへのタスク化は現状スコープ外。
---

# glspinner-notion-tasks

## このスキルの立ち位置

`glspinner-ideation`が「アイディアを出す」ところまでを担当するのに対し、このスキルは「出したアイディアのうち実際にやりたいものをNotionのタスクとして残す」ところを担当する。発想ロジックそのものは持たず、`glspinner-ideation`と共有の`.claude/commands/glspinner-ideas.md`を呼び出す。

Notion MCP（`mcp__claude_ai_Notion__*`ツール群）が接続済みであることが前提。未接続の場合はその旨をユーザーに伝えて中断する。

## 前提: 対象Notion DB

登録先DBの情報（data source ID・URL）は、SKILL.md本体にはベタ書きせず`~/.claude/notion-databases.json`（**リポジトリの外**、ユーザーのホーム配下）の`glspinner_task`エントリを一次情報源として参照する。このファイルはglspinner専用ではなく、他プロジェクト（`tech-issue`/`tech-retro`/`notion-task-sync`等）とも共有するマシン単位の設定ファイルで、`{ "<key>": { "display_name": ..., "data_source_id": "collection://...", "url"?: ..., "used_by": [...] } }`というフラットな構造を持つ。`glspinner_task`エントリの`used_by`には`"glspinner-notion-tasks"`が含まれている。このリポジトリはpublicのため、data source IDやページURLをコミットしたくないという理由でリポジトリ外に置いている。DBの切り替えが発生した場合はこの外部JSONファイルだけを更新すればよく、SKILL.mdの書き換えは不要。

`~/.claude/notion-databases.json`自体が存在しない、または`glspinner_task`エントリが無い場合（新しい環境で初めて実行する場合など）は、ユーザーに実際のdata source ID等を確認して該当エントリを追記するよう促す（他プロジェクトのエントリは削除・上書きしないこと——共有ファイルのため）。

このJSONに記載のDBが見つからない・IDが変わっている等でアクセスできない場合は、決め打ちで別のDBに登録せず、`mcp__claude_ai_Notion__notion-search`で`display_name`を検索し直し、候補をユーザーに確認してから進める。確認が取れたら`~/.claude/notion-databases.json`の該当エントリも更新しておく。

登録先DBのプロパティ定義（`Name`/`Status`/`Order`/`TODO参照`）はこのファイルには含まれない（他プロジェクトと共有するフラット構造のため、DB固有のスキーマ情報は載せていない）。プロパティ定義は下記「3. Notionページの作成」に直接記載する一次情報源として扱う。

## 実行手順

### 1. アイディア（または分割元ドキュメント）の用意

直前の会話ですでに`glspinner-ideation`（または`/glspinner-ideas`）の結果が出ている場合はそれをそのまま使う。

**既存の設計ドキュメント・タスクページ（Notion URL等）を実装手順単位に分割してタスク化したい場合**は、`/glspinner-ideas`は使わない（ゼロからの新機能発想専用のcommandのため、既存ドキュメントを渡しても意図した分割にならない）。代わりに対象を`mcp__claude_ai_Notion__notion-fetch`等で取得し、内容を読み解いて実装順の手順単位に分割する。分割時は依存関係（何が終わっていないと着手できないか）を意識し、各手順に短い説明・影響範囲（対象クラス/ファイル）を添える。分割元がすでに同じ`glspinner_task` DB内のページ（1つの大きなタスクを後から分割するケース）であることもある。

上記どちらの元ネタも無い場合は`/glspinner-ideas $ARGUMENTS`を実行してアイディアを新規に発想する（`$ARGUMENTS`もユーザー指定も無ければ、発想範囲をどうするか一言確認する）。

### 2. タスク化するアイディア（または分割した手順）をユーザーに選んでもらう

出揃ったアイディア・手順を無条件に全部Notionへ登録しない。番号付きで一覧提示し、どれをタスク化するか（複数選択可）をユーザーに確認する。AskUserQuestionのmultiSelectを使うか、通常のチャットで確認するかは状況に応じてよいが、必ず選択のステップを挟むこと。AskUserQuestionは選択肢が4件までしか出せない仕様のため、候補が5件以上ある場合（設計ドキュメントを多数の手順に分割した場合など）は通常のチャットで番号を回答してもらう形にする。

### 3. Notionページの作成

選ばれたアイディアごとに、`mcp__claude_ai_Notion__notion-create-pages`で以下の内容のページを作成する（複数選ばれた場合は`pages`配列にまとめて1回で作成してよい）:

- **parent**: `{"type": "data_source_id", "data_source_id": "<~/.claude/notion-databases.jsonのglspinner_task.data_source_idから\"collection://\"接頭辞を除いたUUID>"}`
- **properties**: 以下のプロパティ定義に従う（`Name`のプレフィックスは付けない。glspinner専用DBのため）。
  - `Name`（title）: アイディア名
  - `Status`（status）: `未着手`/`進行中`/`完了`のいずれか。新規作成時は`未着手`を使う。
  - `Order`（number）: 着手順序。本来はプロジェクトルートのTODO.md §11の番号と対応させる想定。**1つの大きなタスク・設計ドキュメントを複数手順に分割して登録する場合は、実装順に1始まりの連番を振る**（例: 2026-07-24、「Material/Mesh Uniform受け渡し方式リファクタ」を9手順に分割した際、1番目に着手する手順に`1`、6番目に着手する手順に`6`を設定した）。単発のアイディア登録でTODO.mdもまだ無い場合は省略してよい。
  - `TODO参照`（text）: 関連するTODO.mdのセクション番号を入れるのが本来の用途。TODO.md未作成の間は、空欄のままにせず、分割元が何であるかが分かる短いグループラベルを入れる運用にした（例: 2026-07-24、上記リファクタ分割時は全手順に`"リファクタリング"`を設定）。単発のアイディア登録でグループ化の必要が無い場合は省略してよい。
- **content**（Notion Markdown本文）: アイディア単発の場合は`glspinner-ideas`が出したフォーマット（アイディア名／一言説明／既存アーキテクチャへの乗せ方／難易度目安）をほぼそのまま箇条書きで転記し、本文冒頭に「`glspinner`プロジェクトのideationから」の一言を添えて由来が分かるようにする。既存ドキュメントからの手順分割の場合は、各手順の説明・影響範囲に加え、分割元ページへの`<mention-page>`リンクを含めて由来を辿れるようにする。

**既存ドキュメントを手順分割した場合は、`content`内の`<mention-page>`リンクに加えて、DB上でも構造的な親子関係を付ける**（2026-07-24決定）。`glspinner_task`データソースには自己参照の双方向Relationプロパティ`Parent task`/`Sub-tasks`が存在する（無ければ`mcp__claude_ai_Notion__notion-update-data-source`で`ADD COLUMN "Parent task" RELATION('<data_source_id>', DUAL 'Sub-tasks' 'sub-tasks')`を実行して追加する）。各手順ページ作成後、`notion-update-page`（`update_properties`）で`Parent task`に分割元ページのURLを配列で設定する（`{"Parent task": ["<分割元ページURL>"]}`）。分割元ページ側には自動で`Sub-tasks`に逆参照が反映される。

`notion-create-pages`を呼ぶ前に、Notion Markdownの仕様（`notion://docs/enhanced-markdown-spec`）をまだ読んでいなければ一度確認しておくと安全（記法を推測で書かない）。

### 4. 結果の報告

作成した各ページのタイトルとURLを一覧でユーザーに報告する。選ばれなかったアイディアがあれば、それらは登録していない旨も一言添える。

## 完了後

登録したタスクのうち優先度の高いものがあれば、設計を詰めるなら`glspinner-design`、すぐ実装するなら`glspinner-implement`へ進めるとよいと案内する。

## 他SKILLとの関係

- `glspinner-ideation`: アイディア発想そのものの担当。発想だけで完結する依頼はこちらへ案内する。
- `glspinner-ideas`（command）: 実際の発想ロジック本体。両SKILLから共通で呼ばれる。
