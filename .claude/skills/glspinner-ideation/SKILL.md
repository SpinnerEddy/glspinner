---
name: glspinner-ideation
description: glspinnerに追加できそうな新機能・実験ネタを、既存の痕跡に縛られずゼロから発想する。WebGL練習用ツールという性格を踏まえ、既存アーキテクチャ（RenderTag/Slot、BaseShaderPass、Operation+Baseパターン等）にどう乗るかまで含めて具体的なアイディアを出す。「新しい機能のアイディアが欲しい」「こんなエフェクト追加できないか発想して」「次に何か面白いことをやりたい」など、既存コードに未完成の痕跡があるかどうかに関わらず新規アイディアを求められたら必ずこのスキルを使う。既にコード上にやりかけの痕跡がある項目の棚卸しはglspinner-task-discoveryの仕事なので、そちらと混同しない。発想したアイディアをNotionのタスクとして残したい場合はglspinner-notion-tasksの仕事なので、そちらへ引き継ぐ。
---

# glspinner-ideation

## このスキルの立ち位置

`glspinner-task-discovery`が「すでにコードに残っている、やり残しの証拠」を拾うのに対し、このスキルは証拠の有無に関係なくゼロから新しいアイディアを出す。ただし出しっぱなしの空想ではなく、glspinnerが「SpinnerEddy氏によるWebGL practicing用ツール」（`.claude/rules/general.md`冒頭「プロジェクト概要」）であることを踏まえ、実際に手を動かして学びがある・既存アーキテクチャに現実的に乗せられるアイディアを優先する。

発想ロジックそのものは`glspinner-notion-tasks`（発想結果をNotionタスク化するSKILL）と共有するため、`.claude/commands/glspinner-ideas.md`というcommandに切り出してある（`glspinner-context`と同型の構成）。このSKILLは「発想して提示し、次の作業へ引き継ぐ」という利用者向けの入口を担う。

## 実行手順

### 1. アイディアの発想

`/glspinner-ideas $ARGUMENTS`（`.claude/commands/glspinner-ideas.md`）を実行する。ユーザーから範囲・テーマの指定があればそのまま渡し、無ければcommand側の既定（既存の得意領域を横断的にカバー）に任せる。出てきたアイディア一覧をそのままユーザーに提示する。

### 2. 完了後

ユーザーが気に入ったアイディアがあれば、以下のいずれかへ引き継ぐことを案内する:

- 設計を詰めるなら`glspinner-design`
- 小さくてすぐ書けるなら`glspinner-implement`
- 今すぐ実装せず、Notionにタスクとして残しておきたいなら`glspinner-notion-tasks`
