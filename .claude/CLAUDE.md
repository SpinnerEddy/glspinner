# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

`glspinner`（SpinnerEddy氏によるWebGL practicing用ツール）は、シーングラフ・ポストエフェクトチェーン付きの多段レンダリングパイプライン・マテリアル/メッシュ・入力デバイス（キーボード/マウス/MIDI）・オーディオ入力・フレームキャプチャ録画・lil-guiデバッグツールを備えた、自作のWebGL2フレームワーク。ライブラリとして`dist/spinnergl-lib.*.js`をビルドし、公開APIは2つのエントリポイントに分かれる: `src/index.ts`（コアAPI、`dist/spinnergl-lib.{es,cjs,umd}.js`）と`src/tools.ts`（`lil-gui`/`jszip`に依存するGUIコントローラー群・`Recorder`、`dist/spinnergl-lib.tools.{es,cjs}.js`）。`lil-gui`/`jszip`はコア側のビルドからexternal化されており、`tools`側を使わない限りバンドルに含まれない。`examples/`は開発用サンドボックスで、公開ライブラリには含まれない。

## コマンド

- `npm run dev` — `examples/`を対象にVite開発サーバーを起動する（`vite.config.ts`で`root: 'examples'`、ポート2222）。
- `npm run build` — `tsc`（型チェックのみ、`noEmit: true`）→`vite build`（コアライブラリビルド、エントリ`src/index.ts`、フォーマットes/cjs/umd、`vite.config.ts`）→`vite build --config vite.tools.config.ts`（toolsライブラリビルド、エントリ`src/tools.ts`、フォーマットes/cjsのみ）。両ビルドとも`lil-gui`/`jszip`はexternal化。
- `npm run build:types` — `rollup -c rollup.dts.config.js`。`rollup-plugin-dts`が`src/index.ts`/`src/tools.ts`を直接読み込んで型を抽出・バンドルし、`dist/spinnergl-lib.d.ts`/`dist/spinnergl-lib.tools.d.ts`を生成する（`tsc`による個別`.d.ts`出力や`dist/types`という中間ディレクトリは経由しない）。
- `npm test` — Jestの全テストを実行（`ts-jest`、`testEnvironment: 'node'`）。
- `npm run test:watch` — Jestをwatchモードで実行。
- 単一テストファイルの実行: `npx jest tests/math/MathUtilityTest.ts`（`tests/`配下の任意のパスを指定可能）。
- `npm run lint` / `npm run lint:fix` — ESLint（`eslint.config.mjs`）でチェック/自動修正する。
- `npm run format` / `npm run format:check` — Prettier（`.prettierrc.json`/`.prettierignore`）で整形/整形チェックする。
- `package.json`には`npm run dev:lib`もあるが、参照先の`src/libs/vite.config.ts`がこのリポジトリに存在しない。現状壊れているスクリプトとして扱うこと。

ESLint/Prettierは`glspinner-linter`スキルにより導入済み（`eslint.config.mjs`/`.prettierrc.json`/`.prettierignore`）。何を機械的にカバーしていて何をカバーしていないかの詳細は`.claude/rules/general.md`「この文書について」節を参照（要点: 命名規則の一部のみを機械強制しており、規約の大半は依然`.claude/rules/`が一次情報源）。

## アーキテクチャ

### レイヤー構成

```
src/app/            BaseApplicationのライフサイクル（preload → setup → Sceneループ）
src/scene/core/      Scene（rAFループ）、SceneGraph、SceneNode階層
src/scene/transform/ Transform（位置・回転・スケール、遅延ワールド行列再計算）
src/scene/camera/    Camera（透視/正投影）
src/scene/material/  BaseMaterial + 具象マテリアル群
src/scene/mesh/      BaseMesh + 具象メッシュ群
src/scene/light/     ライトのデータオブジェクト
src/scene/audio/     AudioOutput + 差し替え可能なAudioInputOperationソース群
src/scene/renderer/  RendererContext, flow/, pipeline/, postEffect/, context/（詳細は後述）
src/scene/factory/   MaterialFactory（Geometry/MeshはFactory化されておらず直接インスタンス化する）
src/input/           InputHub配下のKeyboard/Mouse/Midiデバイス
src/webgl/gl/        WebGL2の薄いラッパー層（Shader, Buffer, FBO, Geometry, Texture, Font, Uniform, Attribute）
src/math/, src/color/  Vector/Matrix/Quaternion と Color の値型・計算ユーティリティ
src/tools/           Recorder（フレームキャプチャ）と lil-gui コントローラー群
```

アプリケーションは`BaseApplication`を継承し`setup`/`update`/`draw`を実装する（`examples/sample.ts`参照）。`BaseApplication.start()`が`preload()` → `setup()` → `Scene.start()`の順に実行し、以後`Scene`が`requestAnimationFrame`で全体を駆動する。

### レンダリングパイプライン（このコードベースの中核）

3つの層があり、それぞれ下位層への直接参照ではなくスロット/タグを介して意図的に疎結合になっている:

```
SceneRendererPipeline  （1フレームを統括: 不透明パス → ポストエフェクト → 最終ブリット → オーバーレイパス）
 └─ RendererFlowOperation[]   （StandardSceneRendererFlow / PostEffectRendererFlow / FinalBlitRendererFlow）
      └─ ShaderPassOperation  （BaseShaderPass派生の各ポストエフェクトパス）
           └─ RenderTargetOperation （RenderTarget / CustomRenderTarget / ScreenRenderTarget / PingPongRenderTarget）
```

- `RenderTag`（`BACKGROUND/OPAQUE/EMISSIVE/TRANSPARENT/DISTORTION/OVERLAY/ALL`）が各パスの描画対象ノードを決める。現状配線されているのは`OPAQUE`と`OVERLAY`のみ。`RendererContext.setActivateRenderTag()`と`SceneNode.shouldDraw()`がこのフィルタを実現している。
- `RenderTargetRegistry`は`RenderTargetSlot`（`CURRENT_FRAME`, `TEMP_FRAME_BUFFER`, `PREV_FRAME`, `HALF_RES_BUFFER`, `BRIGHT_PASS_BUFFER`, `BLOOM_RENDER_TARGET`, `PINGPONG_TEMP_BUFFER`）をキーにした`RenderTargetOperation`の`Map`プール。各パスは互いへの参照を持たず、このプールからスロット指定で取り出す。
- `SceneRendererPipeline.render()`は2枚のRT（`readRT`/`writeRT`、各段の後にswap）を有効なポストエフェクトチェーンに通すping-pong方式。無効化された`PostEffectRendererFlow`は`gl.blitFramebuffer`でシェーダパスをバイパスするので、エフェクトのON/OFF切り替えがread/write連鎖の整合性を崩さない。
- `RendererContext`はフレーム単位のハブ: カメラ・ライト・`GlobalUniforms`のUBO（view/projection/time/resolution/mouseを`ShaderUniformBuffer`でパック）・現在のシェーダプログラム（無駄な再バインド防止用）・RTレジストリを持つ。
- パイプライン自体はアプリ側が`setup()`内で`addSceneRendererFlow`/`addPostEffectFlow`/`addFinalBlitFlow`を使って組み立てる。固定のデフォルトチェーンは無い（`examples/sample.ts`はBloom→Bright→横Blur→縦Blur→GrayScale→Mosaic→RGBShift→Glitchという例）。

### `XxxOperation` + `BaseXxx` パターン

多くのサブシステムが「インターフェースで契約を定義 → 抽象`BaseXxx`が共通実装を提供 → 具象クラスが差分のみ実装」という構成を取る（Application, Mesh, Material, Geometry, Buffer, RenderTarget, RendererFlow, ShaderPass, Deviceなど）。**このパターンは全ファミリーに一律に適用されているわけではない**——ファミリーごとに異なる形で標準形から外れている例が複数ある。触る前に「このパターンだろう」と決め打ちせず、`.claude/rules/`配下の該当ファイルを先に読むこと（横断的な命名・フォーマットは`general.md`、パターンそのものと例外一覧は`operation-base.md`、それぞれのクラスファミリー固有の規約は`material.md`/`device.md`/`node.md`/`mesh.md`/`pipeline.md`/`pass.md`/`flow.md`/`buffer.md`/`geometry.md`/`render-target.md`/`vector-matrix.md`）。

### 気づきにくい挙動

- `LightFactory.ts`は存在するが中身が空。`MidiDevice`はMIDIメッセージを受信するが`isDown`/`isPressed`/`isReleased`は`false`固定のスタブ。
- 一見バグに見えるが実は意図的な規約であるもの（等価比較演算子`==`/`===`の混在、JSDocが一切無い、無効化したコードは削除せずコメントアウトで残す、`Geometry`/`Mesh`が`Material`と違いFactory化されていない、等）が複数ある。詳細は`.claude/rules/general.md`と`.claude/rules/operation-base.md`にカタログ化してあるので、「矛盾している」ように見えるコードを直す前に必ず確認すること。

## 編集範囲の制限

glspinnerのライブラリ本体に関わるコード——シェーダー（`src/webgl/shader/`配下の`.vert`/`.frag`）、および`src/`配下のTypeScript全般（`src/app/`, `src/scene/`, `src/webgl/gl/`, `src/input/`, `src/math/`, `src/color/`, `src/tools/`のロジック・機能・WebGL実装）——は、原則として**Claude Codeによる直接のコード編集を禁止**する。ユーザー自身が実装することで内容を理解している状態を保つための運用ルールであり、コードの巧拙とは無関係の制約である。

### 例外: 会話内で完全に確定した機械的反映（2026-08部分緩和）

以下の**両方**を満たす場合に限り、Claude Codeがsrc/配下（シェーダー含む）を直接編集してよい。当初は全面禁止だったが、「設計判断は会話で固まっているのに、確定した内容をユーザーが手で書き写すだけの往復」でテンポが悪化する問題が実際に発生したため、目的（考える部分は自分でやる）を保ったまま往復コストだけを削る形で緩和した。

1. **新規の設計判断を伴わない**: 実装すべき内容（アルゴリズム・パターン・具体的なコード）が会話内で既に完全に確定しており、Claudeがその場で新たに決めることが何も無い状態であること。典型例: 既存の確立済みパターン（同じファミリーの他クラスの実装、例: `Plane.ts`の`setUpBuffers()`）をほぼそのまま新規クラスへ適用するだけの反映、レビューで合意済みの具体的な1〜数行の修正（例: インデックス配列の並びをこの値に変える、といった確定済みの指摘の反映）。
2. **ユーザーが直接その提案に同意している**: 「この内容で直接編集してOK」に類する明示の同意がある状態。会話の流れから当然実装フェーズに入っている、という程度の暗黙の推測だけでは発動しない。

新しいアルゴリズム・データ構造・アーキテクチャ上の判断を伴うコード（新規サブシステムの設計、初出のロジック、既存パターンの単純適用に収まらない実装）は、たとえ会話で詳しく検討していても引き続き手動実装のまま——「考える部分は自分で書く」という本来の目的はここに残す。判断に迷う場合は手動実装側（現状維持）に倒す。

Claude Codeが常時・無条件に直接編集してよいのは以下に限る（上記の例外条件を満たさなくても常に編集可）:
- テストコード（`tests/`配下）
- Vite設定関連ファイル（`vite.config.ts`, `vite.tools.config.ts`等）
- JSON設定ファイル（`package.json`等）
- Markdownファイル（`README.md`, `.claude/CLAUDE.md`, `.claude/rules/`配下等）

一方、コードを直接編集しない形の支援——設計相談、コードレビュー、実装方針の提案、Notion等外部ドキュメントへの記録、`glspinner-design`/`glspinner-review`/`glspinner-task-discovery`のような分析系スキルの実行——はこの制限の対象外で、これまで通り行ってよい。実装を伴う依頼を受けた場合は、対象ファイルが上記の編集可能範囲（常時可、または上記の例外条件を満たす機械的反映）に収まるかをまず確認し、収まらない場合はコード変更を行わず、設計方針の言語化やレビューといった代替の形で支援する。

## プロジェクト固有のClaude Codeスキル

`.claude/skills/`・`.claude/commands/`配下に、このプロジェクトの定型作業向けカスタムスキル/コマンドがある: `glspinner-context`（共通の下準備、設計・規約コンテキストの収集）、`glspinner-design`、`glspinner-implement`、`glspinner-test`、`glspinner-review`、`glspinner-tidy`（意味を変えない機械的整形のみ）、`glspinner-document`、`glspinner-reading`、`glspinner-task-discovery`（既知ギャップの棚卸し）、`glspinner-ideation`（アイディア発想。発想ロジック本体はcommand `glspinner-ideas` に切り出されており`glspinner-notion-tasks`と共有）、`glspinner-notion-tasks`（発想したアイディアをユーザーが選んだ分だけNotionの「✔️ タスク管理」DBにタスク登録する）、`glspinner-retro`（技術的な壁打ち・振り返りを見出し+箇条書きに整理してNotionの「📝 振り返り」DBへ記録する）、`glspinner-conventions`（`.claude/rules/`を管理）。該当する作業ではその場しのぎではなくこれらのスキルを優先して使うこと。

## テストに関する注意

- テストは`tests/`配下に`src/`のディレクトリ構造をミラーして置かれ、`XxxTest.ts`という命名（`Xxx.test.ts`ではない）で、相対パスでimportする（`jest.config.ts`の`@/`エイリアスは定義されているが既存テストでは使われていない）。
- 現状テストがあるのは純粋なロジックのみ（`tests/math/`, `tests/color/`, `tests/scene/`の1ファイル）。WebGLコンテキストに依存するコード（`webgl/gl/`, `scene/renderer/`）はユニットテストが無く、`testEnvironment: 'node'`下では意味のあるテストが書きづらい。そちらはアプリを実際に動かして検証すること。

## 既知の未解決事項（READMEより）

- マテリアルとジオメトリの関係性を精査する必要がある。立方体など描けるジオメトリの種類を増やしたい。ライティングは作業中。
- その後の予定: インスタンシング。
- 未解決の課題: 現状のUBOのまとめ方が適切か。MIDIコントローラーの設計（チャンネル定義、操作への処理紐づけ、LED制御）が固まっていない。
