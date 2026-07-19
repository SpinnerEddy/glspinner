# glspinner向けSKILL整備 進捗メモ

作成日: 2026-07-19
更新日: 2026-07-19

## 目的

以下の作業単位ごとに、glspinnerプロジェクト専用のSKILLを1つずつ作る。1つのSKILLに詰め込まず、やること単位で分割する。複数SKILLで共通して発生する下準備（設計・規約の把握など）は、個別のSKILLに重複実装せず、共通のcommandとして切り出して各SKILLから参照させる。

対象の作業単位（ユーザーが挙げた原文ベース）:

1. 実装項目の洗い出し
2. 設計
3. 実装
4. テスト
5. アイディア出し
6. コード規約の整理と改訂
7. コードレビュー
8. コードの細かい整理整頓（空白の数など）
9. ドキュメント化
10. コードリーディング

## 完了（全10項目）

- **`glspinner-conventions`** SKILL（`.claude/skills/glspinner-conventions/SKILL.md`） — 6「コード規約の整理と改訂」
  - `src/`の実コードから命名規則・フォーマット・import順・Operation+Baseパターン適用ルールなどを抽出し、`.claude/rules/`配下に**クラスファミリー単位**（`~Material`, `~Device`, `~Node`, `~Mesh`, `~Pipeline`, `~Pass`, `~Flow`, `~Buffer`, `~Geometry`, `~RenderTarget`, `Vector`/`Matrix`系、およびどのファミリーにも属さない横断規約`general.md`とメタパターン`operation-base.md`）で分割したmdファイル群として明文化・改訂する。
  - 成果物は`.claude/rules/general.md`, `operation-base.md`, `material.md`, `device.md`, `node.md`, `mesh.md`, `pipeline.md`, `pass.md`, `flow.md`, `buffer.md`, `geometry.md`, `render-target.md`, `vector-matrix.md`の13ファイル。単一ファイル`claude_io/coding-conventions.md`は廃止（詳細は下記「改訂履歴」2026-07-19（2回目）参照）。他SKILLはこのファイル群を一次情報源として参照する。

- **`glspinner-task-discovery`** SKILL（`.claude/skills/glspinner-task-discovery/SKILL.md`） — 1「実装項目の洗い出し」
  - README・design.md・TODOコメント・空ファイル・配線されていない実装・テストカバレッジのギャップなどを横断的に洗い出し、優先度付きでリスト化する。
  - アイディア出し（5）とは切り分け、`glspinner-ideation`に委譲する。

- **`glspinner-design`** SKILL（`.claude/skills/glspinner-design/SKILL.md`） — 2「設計」
  - 実装着手前に、既存アーキテクチャ（Operation+Baseパターン、RenderTag/Slotベースの疎結合設計等）との整合性を踏まえた設計案を作り、必要なら`claude_io/design.md`に反映する。
  - 完了後は`glspinner-implement`に引き継ぐ想定。

- **`glspinner-implement`** SKILL（`.claude/skills/glspinner-implement/SKILL.md`） — 3「実装」
  - `glspinner-context`で下準備し、規約・既存パターンに沿って実装。型チェック・関連テストで検証し、WebGL依存部分は`run`/`verify`スキルでの目視確認に誘導する。

- **`glspinner-ideation`** SKILL（`.claude/skills/glspinner-ideation/SKILL.md`） — 5「アイディア出し」
  - `glspinner-task-discovery`（既存の痕跡ベース）とは対照的に、証拠の有無に関係なくゼロから新機能・実験ネタを発想する。カテゴリ別（ポストエフェクト/ジオメトリ/入力/オーディオ/GUI/学習用途）に、既存アーキテクチャへの乗せ方まで含めて提案する。

- **`glspinner-test`** SKILL（`.claude/skills/glspinner-test/SKILL.md`） — 4「テスト」
  - Jest（ts-jest）で`tests/`配下の既存構成（`XxxTest.ts`命名、srcディレクトリ構造のミラー、相対import）に沿ってテストを追加。WebGLコンテキスト依存コードはユニットテスト化しづらい旨を明記し、`run`/`verify`スキルへの誘導も持つ。

- **`glspinner-review`** SKILL（`.claude/skills/glspinner-review/SKILL.md`） — 7「コードレビュー」
  - 汎用`/code-review`（正しさ・簡潔性・効率）とは別レンズとして、Operation+Baseパターン適用の妥当性・`.claude/rules/`配下との突き合わせ・design.mdの疎結合機構（RenderTag/Slot/Factory）との整合性をチェックする。

- **`glspinner-tidy`** SKILL（`.claude/skills/glspinner-tidy/SKILL.md`） — 8「コードの細かい整理整頓」
  - `/simplify`（意味のある改善）とは別に、挙動を変えない純粋なフォーマット統一（インデント・空白・セミコロン・クォート等）に特化。ESLint/Prettier不在のため人力整形を担当。

- **`glspinner-document`** SKILL（`.claude/skills/glspinner-document/SKILL.md`） — 9「ドキュメント化」
  - README.md（次やること/その後/課題）・`claude_io/design.md`（アーキテクチャ）・ソースコード中のコメント/JSDocの3種類を使い分けて更新する。`.claude/rules/`配下自体の管理は対象外（`glspinner-conventions`の担当）。

- **`glspinner-reading`** SKILL（`.claude/skills/glspinner-reading/SKILL.md`） — 10「コードリーディング」
  - `glspinner-context`（他SKILLの下準備用ダイジェスト）とは違い、コードを読んで理解すること自体がユーザーのゴールであるときに使う。実行フローをfile:line付きで辿り、設計意図とたまたまの実装詳細を区別して説明する。

- **`glspinner-context`** command（`.claude/commands/glspinner-context.md`）
  - 「複数SKILLで共通して発生する下準備」を切り出した共通command。`claude_io/design.md`と`.claude/rules/`配下（`general.md`を起点にファミリーファイル一覧の索引をたどる）を読み、対象トピックに関連するファイル・お手本実装を洗い出して「コンテキストダイジェスト」を定型フォーマットで出力する。
  - 設計・実装・レビュー・整理整頓・ドキュメント化・コードリーディングなど、コードに触れるほぼ全SKILLがこのcommandを呼んで下準備を済ませる。

- 前提ドキュメント
  - `claude_io/design.md`: プロジェクト概要〜設計上の特徴まで10章構成。SKILL群が参照する設計の一次情報源。
  - `.claude/rules/`: `glspinner-conventions`SKILLが管理する規約の一次情報源（13ファイル、詳細は上記）。

## 未着手

なし。対象10項目のSKILL・commandはすべて作成済み。

## 改訂履歴

- 2026-07-19（1回目）: 初回作成時（後発8SKILL）は、先行2SKILL（`glspinner-conventions`/`glspinner-task-discovery`）に比べて`claude_io/coding-conventions.md`の具体的な記述（`==`/`!=`規約、`_`接頭辞不使用、JSDoc皆無、タブ混入1箇所など）を踏まえきれておらず内容が一般化・希薄だった。ユーザー指摘を受け、`glspinner-design`/`glspinner-implement`/`glspinner-review`/`glspinner-tidy`/`glspinner-document`/`glspinner-reading`に、coding-conventions.mdの具体的な条文への参照と、「一般的なTS作法とglspinner規約が食い違う箇所（`==`使用、JSDoc不使用等）で一般作法に引っ張られない」という注意を追記した。
- 2026-07-19（2回目）: ユーザーから「`glspinner-conventions`の出力を`.claude/rules/`配下に、接頭辞・接尾辞が同じクラス単位（`~Operation`/`Base~`, `~Material`, `~Device`, `~Node`, `~Mesh`, `~Pipeline`, `~Pass`, `~Flow`, `~Buffer`等）でファイル分割してほしい」という指示を受け、単一ファイル`claude_io/coding-conventions.md`を廃止し`.claude/rules/`配下13ファイルへ再構成した。横断的な規約のみ`general.md`に残し、`XxxOperation`+`BaseXxx`パターンそのものの適用基準と、標準形から外れる小規模ファミリー（Application/Clock/Scene/Light、いずれも`Base`接頭辞を使わない変則パターン）を`operation-base.md`にまとめ、ユーザー例示の8ファミリーに加え`geometry.md`/`render-target.md`/`vector-matrix.md`を「etc」の範囲として追加した。再構成の過程で実コードを読み直し、`BaseDevice`が共通ロジックを持たない（各デバイスがisDown等を重複実装）、`BloomShaderPass`が`BaseShaderPass`を継承しない、`PingPongRenderTarget`が`RenderTargetOperation`を実装しない、`RenderTarget.ts`が`===`/`!==`を使う、`SceneNode.ts`が同一ファイル内で`==`と`===`を混在させている、といった初版のcoding-conventions.mdにはなかった具体的な例外を多数発見し各ファミリーファイルに記録した。この改訂に伴い、`glspinner-context`コマンドおよび`glspinner-implement`/`glspinner-review`/`glspinner-tidy`/`glspinner-document`/`glspinner-design`/`glspinner-reading`/`glspinner-task-discovery`/`glspinner-test`の参照パスをすべて`.claude/rules/`へ更新した。

## 今後の運用メモ

- 各SKILLは実コード・既存ドキュメントの現状を前提に書かれている。`src/`の構造やREADME/design.mdの内容が大きく変わった場合（例: `LightFactory`が実装される、`MidiDevice`が完成する等）は、該当SKILL（特に`glspinner-design`/`glspinner-ideation`/`glspinner-task-discovery`）の記述が古くならないか見直す価値がある。
- SKILL間の依存関係: `glspinner-context`（下準備）→ `glspinner-design`（設計）→ `glspinner-implement`（実装）→ `glspinner-test`/`glspinner-review`/`glspinner-tidy`（検証・仕上げ）→ `glspinner-document`（反映）という大まかな流れを想定しているが、変更の規模に応じて途中を省略してよい。`glspinner-task-discovery`と`glspinner-ideation`はこの流れの起点（何をやるかを決める段階）として独立に使われる。`glspinner-reading`は上記の流れとは独立して、理解目的で単独利用される。
