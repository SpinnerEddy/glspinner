---
description: glspinnerに追加できそうな新機能・実験ネタを、既存アーキテクチャに乗せられる形で具体的に発想する処理そのもの（glspinner-ideation SKILLとglspinner-notion-tasks SKILLが共通で呼び出す）
argument-hint: [発想したいテーマや範囲（任意）]
---

# glspinner-ideas

`glspinner-ideation`SKILLが持っていた「アイディアを発想する」処理そのものを、`glspinner-context`と同型でcommand化したもの。`glspinner-ideation`（発想して終わり）と`glspinner-notion-tasks`（発想結果をNotionタスク化する）の両方がこのcommandを呼び出す共通処理のため、どちらか一方のSKILL固有の手順としては置かず、独立したcommandとして持つ。

対象テーマ: `$ARGUMENTS`

（テーマが空の場合は、既存の得意領域を横断的にカバーする形で発想する。呼び出し元SKILLがすでに範囲をユーザーに確認済みの場合はそちらに従う。）

## 手順

### 1. 土台の把握

`.claude/rules/general.md`のディレクトリ構成と責務マップ、および関連する各ファミリーファイル（`pass.md`, `node.md`, `device.md`, `audio.md`等）を読み、既存の得意領域（ポストエフェクトチェーン、シーングラフ、入力デバイス抽象化、Transform Feedbackによるプロシージャルオーディオなど）を把握する。特定トピックが指定されている場合は`/glspinner-context $ARGUMENTS`で関連実装も確認する。

### 2. アイディアをカテゴリ別に発想する

範囲の指定がなければ、以下のカテゴリを横断的に検討し、各カテゴリ1〜3個を目安に出す（多すぎても選びにくいので、合計10個前後に絞る）:

- **ポストエフェクト/レンダリング系**: `BaseShaderPass`パターンに乗せやすい新規エフェクト、`RenderTag`の未使用値（BACKGROUND/EMISSIVE/TRANSPARENT/DISTORTION）を活かす描画分岐、`CustomRenderTarget`のマルチアタッチメントを使ったG-buffer的な表現
- **ジオメトリ/マテリアル系**: 新しいプリミティブ形状、`PhongMaterial`以外のライティングモデル、`LightFactory`（現状空ファイル）を活かしたライト種別の拡張
- **入力/インタラクション系**: `MidiDevice`の本実装（README記載の課題と接続）、ゲームパッド等の新規デバイス追加、`InputHub`を使った入力連動エフェクト
- **オーディオ系**: `ShaderAudioInput`（Transform Feedbackによるプロシージャル音声生成）を拡張したビジュアライザーやシェーダー間連携
- **ツール/GUI系**: `GuiUtility`/`*GuiController`パターンを使ったデバッグ・プリセット機能
- **学習・練習用途としての切り口**: 「WebGLの特定機能を練習するために作る」という目的に合致するミニデモ（インスタンシング描画、Compute的な用途でのTransform Feedback活用など。README「その後」に記載のインスタンシングとも関連）

### 3. 各アイディアの提示フォーマット

```
- **[アイディア名]** — 何をするものか一言 ／ 既存アーキテクチャへの乗せ方（どのパターン・どのディレクトリに位置づくか）／ 難易度目安（小/中/大）
```

既存の未完成箇所（`LightFactory`空ファイル等）を活かすアイディアの場合は、それが`glspinner-task-discovery`で挙がっている既知のギャップと関連することを一言添えてよい（このcommand自体がギャップの棚卸しをする必要はない）。

出したら、この一覧をそのまま呼び出し元へ返す。次にどうするか（設計/実装へ引き継ぐ、Notionにタスク化する等）の案内は呼び出し元SKILL側の役割なので、このcommand自体はアイディア一覧の提示で完了とする。
