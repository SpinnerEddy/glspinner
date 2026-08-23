---
name: glspinner-design-doc
description: glspinnerの既存処理に対する改善案・新機能設計についての壁打ち（アーキテクチャ相談、glspinner-designでの設計合意など）を、リポジトリ内design/配下のMarkdownドキュメントとして書き出す。「この修正方針をdesignフォルダにまとめて」「この設計を書き出しておいて」「壁打ちの内容をdesignドキュメント化して」「この提案をファイルに残して」といった、議論・設計をリポジトリ内の恒久的な提案ドキュメントとして残したい依頼が来たら必ずこのスキルを使う。design/はdocs/（現状実装のスナップショット、既存の一括ドキュメント化作業が担当）や.claude/rules/（実装済みパターンの規約、glspinner-conventions担当）とは異なる「未実装の設計提案」専用の置き場所。壁打ちがまだ具体的な設計に至っていない探索段階の場合はglspinner-designへ、Notionに残したい場合はglspinner-retro/glspinner-notion-tasksへ案内する。
---

# glspinner-design-doc

## このスキルの立ち位置

glspinnerのドキュメントは3つの軸に分かれる: `docs/`（今何が実装されているかのスナップショット）、`.claude/rules/`（コードに実際に宿っている規約、`glspinner-conventions`担当）、そして`design/`（これから何を作るかの未実装の設計提案）。このスキルは3つ目の`design/`を担当する。

アーキテクチャ相談や改善案についての壁打ちは、それ自体は会話として消費されて終わりがちだが、検討の過程（何が問題だったか、どの案を検討してどれを採用・却下したか）には後から参照する価値がある。特に`.claude/CLAUDE.md`の編集範囲制限により`src/`配下の実装は基本的にユーザー自身が行うため、Claude Codeとの壁打ちで固まった設計をコードとは別にリポジトリへ残しておくことは、後日ユーザーが実装する際の実装メモとして機能する。

## 実行手順

### 1. 対象設計が書き出せる状態か確認する

直前の会話（または`glspinner-design`が承認したプラン）に、書き出すに足る具体性があるかを確認する。目安は「対象ファイル・変更理由・検討した代替案とその却下理由」のいずれも言える状態かどうか。

まだ探索的な議論の段階（アーキテクチャの雑感を交わしただけ、方向性が複数残ったままなど）であれば、無理に書き出さず`glspinner-design`（設計相談本体）を先に案内する。「壁打ちの内容そのもの」を記録したい依頼で、かつ実装可能なレベルの具体的な結論に至っていない場合は`glspinner-retro`（Notionの振り返りDBへ記録）の方が適切なこともあるので、目的（リポジトリに設計提案として残したいのか、議論の記録として残したいのか）をユーザーに確認してよい。

### 2. `/glspinner-design-doc <topic>` の実行

`.claude/commands/glspinner-design-doc.md`を実行し、`design/`フォルダの作成・更新、トピック文書の作成・更新を行う。トピック名は`$ARGUMENTS`として渡せるが、無指定でも直前の会話から推定される。

### 3. 完了後

作成・更新したファイルパスを簡潔に報告する。次にどうするかを案内する:

- すぐ実装に進むなら`glspinner-implement`（ただし`.claude/CLAUDE.md`の編集範囲制限により`src/`/`examples/`配下は基本的にユーザー自身の実装になる旨も添える）
- 実装が完了し、規約として残す価値があるパターンになったら`glspinner-conventions`で`.claude/rules/`へ反映する（`design/`側の提案は「未実装」の間だけ存在する暫定ドキュメントで、実装完了後は`docs/`・`.claude/rules/`へ内容が移り、`design/`側は実装済みの印を付けるか整理する）

## 他SKILLとの関係

- `glspinner-design`: 設計そのものを詰める担当。壁打ちがまだ設計として固まっていない場合はこちらへ先に案内する。設計合意後、そのまま書き出したい場合は`glspinner-design`の完了後ステップからこのSKILL（または直接`/glspinner-design-doc`）が呼ばれることもある。
- `glspinner-design-doc`（command）: 実際のファイル作成・更新ロジック本体。このSKILLと`glspinner-design`の両方から共通で呼ばれる。
- `glspinner-conventions`: 実装済みのパターンを`.claude/rules/`へ規約として記録する担当。`design/`はまだ実装されていない提案のみを対象とする点で対象範囲が異なる。
- `glspinner-document`: `README.md`/`.claude/CLAUDE.md`/コード内コメントの担当。`design/`配下はこのSKILLの担当外。
- `glspinner-retro`: 議論を記録として残す点は似ているが、宛先はNotionの「📝 振り返り」DBで、対象は議論の過程・学習相談全般。このSKILLは実装可能なレベルまで具体化した設計提案のみを対象とし、リポジトリ内の`design/`に置く点が異なる。
- `glspinner-task-discovery`/`glspinner-ideation`: 未実装ギャップの棚卸しやゼロからのアイディア発想はそれぞれの担当。このSKILLはそれらの結果を書き出す場所ではなく、あくまで具体的な設計提案の書き出しが対象。
