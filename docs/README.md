# glspinner 設計ドキュメント

このドキュメントは、glspinner（SpinnerEddy氏によるWebGL practicing用ツール）のソースコード（`src/`配下）を実際に読み込んで作成した、技術スタック・アーキテクチャ・実装状況のまとめ。フォルダ単位で`docs/`配下に分割されており、本ファイルはその全体像を統合した入口。2026-08時点のソースコードに基づく（各サブドキュメント内の「既知の制約・未完成部分」節も含め、この時点のスナップショット）。

`.claude/rules/`配下にも詳細な規約ドキュメントが存在するが、あちらは「Claude Codeがこのプロジェクトのコードを書くときに従うべき規約」という切り口。本ドキュメントは「このプロジェクトを初めて読む人が、何が実装されていてどう繋がっているかを理解する」という異なる切り口でまとめている。なお作成過程で、`.claude/rules/`の一部記述が現状のソースと食い違っている（陳腐化している）ことが判明した。詳細は末尾「`.claude/rules/`との既知の食い違い」を参照。

## プロジェクト概要

- **名前**: glspinner（`package.json`の`description`: "SpinnerEddy's tool made for practicing WebGL"）
- **性格**: 個人のWebGL学習・実験用に自作された、Three.js的な立ち位置のミニフレームワーク。シーングラフ・多段レンダリングパイプライン（ポストエフェクトチェーン込み）・マテリアル/メッシュ・入力デバイス（キーボード/マウス/MIDI）・オーディオ入力（外部ファイル/シェーダ生成）・フレームキャプチャ録画・lil-guiデバッグツールを備える。
- **配布形態**: ライブラリとして`dist/spinnergl-lib.*.js`をビルドし、npm経由ではなくGitHub直接参照（`npm install github:SpinnerEddy/glspinner#main`）で利用する。公開APIは2つのエントリポイントに分かれる:
  - `src/index.ts`（コアAPI） → `dist/spinnergl-lib.{es,cjs,umd}.js`
  - `src/tools.ts`（`lil-gui`/`jszip`に依存するGUIコントローラー群・`Recorder`） → `dist/spinnergl-lib.tools.{es,cjs}.js`
  
  `lil-gui`/`jszip`はコア側のビルドから`external`化されており、`tools`側を使わない限りバンドルに含まれない（`peerDependencies`かつ`optional: true`）。
- **`examples/`**: 開発用サンドボックス。公開ライブラリには含まれない。実際にアプリを組み立てる際の唯一の参照実装（`examples/sample.ts`の`Sample extends GLSpinner.BaseApplication`）がここにある。

## 技術スタック

| 分類 | 使用技術 | 備考 |
|---|---|---|
| 言語 | TypeScript 5.8（`strict: true`） | `noUnusedLocals`/`noUnusedParameters`/`noFallthroughCasesInSwitch`等も有効。型チェックのみ行い出力しない（`noEmit: true`）——実際のトランスパイル・バンドルはViteが担う。 |
| グラフィックスAPI | WebGL2（`WebGL2RenderingContext`） | GLSL ES 3.00（`#version 300 es`）。UBO（Uniform Buffer Object）・Transform Feedback（`ShaderAudioInput`）等WebGL2固有機能を活用。 |
| ビルドツール | Vite 6 | `vite.config.ts`（コアライブラリ、エントリ`src/index.ts`、フォーマットes/cjs/umd）と`vite.tools.config.ts`（toolsライブラリ、エントリ`src/tools.ts`、フォーマットes/cjsのみ）の2つのVite設定を`npm run build`が順に実行する。`vite-plugin-glsl`で`.vert`/`.frag`を直接importできる。開発サーバー（`npm run dev`）は`examples/`をrootにポート2222で起動。 |
| 型定義バンドル | `rollup-plugin-dts`（`rollup.dts.config.js`） | `src/index.ts`/`src/tools.ts`を直接読み込んで型を抽出・バンドルし、`dist/spinnergl-lib.d.ts`/`dist/spinnergl-lib.tools.d.ts`を生成する（`tsc`個別出力や中間`dist/types`ディレクトリを経由しない）。 |
| テスト | Jest 29 + ts-jest（`jest.config.ts`） | `testEnvironment: 'node'`。`tests/`配下に`src/`のディレクトリ構造をミラーし`XxxTest.ts`（`Xxx.test.ts`ではない）という命名で配置。現状テストがあるのは純粋ロジック（math/color/scene核の一部）のみ——WebGLコンテキストに依存するコード（`webgl/gl/`, `scene/renderer/`）は`testEnvironment: 'node'`下では意味のあるテストが書きづらく未整備。 |
| Lint/Format | ESLint 9（`typescript-eslint`）+ Prettier 3（`eslint.config.mjs`/`.prettierrc.json`） | クラス/インターフェース/型エイリアスのPascalCase、メソッド・private/protectedメンバーのcamelCaseなど命名規則の一部のみを機械強制。`==`/`!=`と`===`/`!==`の混在は意図的に許容（`eqeqeq`ルール無効化）。規約の大半は依然として`.claude/rules/`が一次情報源。 |
| GUI/デバッグ | lil-gui | `src/tools.ts`側のみ。`GuiUtility`が薄くラップし、5つの`*GuiController`（静的クラス）が機能領域ごとのGUIを構築する。 |
| 録画 | JSZip | フレームキャプチャした複数PNGをZIPにまとめる（`Recorder.saveFramesAsZip()`）。 |
| オーディオ | Web Audio API | `AudioOutput`が`AudioContext`/`AudioBufferSourceNode`をラップ。音データ供給は`fetch`+`decodeAudioData`（`ExternalFileAudioInput`）とWebGL2 Transform Feedbackによるプロシージャル生成（`ShaderAudioInput`）の2方式。 |
| 入力 | DOM標準イベント + Web MIDI API | キーボード/マウスは`keydown`/`keyup`/`mousemove`等、MIDIは`navigator.requestMIDIAccess()`（受信側は未実装、送信側はLED制御を試みる実験コードあり）。 |

## アーキテクチャ全体像

```
BaseApplication（app/）
 ├─ preload() → setup() → Scene.start() という起動シーケンス
 ├─ コンストラクタで一括生成: WebGLUtility / ShaderLoader / TextureLoader / TextFontLoader
 │                          / RendererContext / SceneGraph / AudioOutput
 │                          / SceneRendererPipeline / InputHub
 └─ SceneOperation（Scene or RecordScene）を外部注入で受け取る

SceneGraph（scene/core/）
 └─ SceneNode階層（EmptyNode/GroupNode/MeshNode/TextMeshNode/LightNode系）
     ├─ Transform（位置・回転・スケール、遅延ワールド行列再計算）
     └─ BaseMesh（scene/mesh/）
         ├─ GeometryOperation（webgl/gl/geometry/）— 頂点データ+GPUバッファ
         └─ MaterialOperation（scene/material/）— シェーダへのUniform供給

SceneRendererPipeline（scene/renderer/、1フレームを統括）
 ├─ RendererFlowOperation[]（Standard / PostEffect / FinalBlit）
 │    └─ ShaderPassOperation（BaseShaderPass派生の各ポストエフェクト、pass層）
 │         └─ RenderTargetOperation（RenderTarget / CustomRenderTarget / ScreenRenderTarget / PingPongRenderTarget）
 └─ RendererContext（フレーム単位の共有状態: camera/lights/globalUniformBuffer/currentShaderProgram/renderTargetRegistry/activateRenderTag）
```

3つの層（Pipeline → Flow → ShaderPass → RenderTarget）は互いへの直接参照を持たず、`RenderTag`（描画レイヤー分類）と`RenderTargetSlot`（FBOスロット名）という「名前で引く」機構を介して疎結合に組み合わさる。詳細は[`scene/renderer.md`](scene/renderer.md)。

## `XxxOperation` + `BaseXxx` パターン

多くのサブシステムが「インターフェースで契約を定義 → 抽象`BaseXxx`が共通実装を提供 → 具象クラスが差分のみ実装」という三段構成を取る（Application, Mesh, Material, Geometry, Buffer, RenderTarget, RendererFlow, ShaderPass, Device, Clockなど）。ただしこのパターンは全ファミリーに一律ではなく、ファミリーごとに異なる形で標準形から外れる（`Clock`のように`Base`接頭辞を使わない例外、`BaseDevice`のように共通ロジックがほぼ無い例外、`~RenderTarget`のように`BaseXxx`層自体が存在しない例外、`~Node`のようにインターフェースそのものが存在しない例外など）。各フォルダのドキュメント内「アーキテクチャ・設計パターン」節で、標準形か・どう外れているかを記載している。

## フォルダ別ドキュメント一覧

| フォルダ | ドキュメント | 内容 |
|---|---|---|
| `src/app/` | [`app/app.md`](app/app.md) | アプリケーションライフサイクル。`ApplicationOperation`→`BaseApplication`→`RecordingApplication`の2段中間抽象クラス |
| `src/math/` | [`math/math.md`](math/math.md) | Vector2/3/4・Matrix22/33/44・Quaternion。自己参照ジェネリクス（CRTP風）パターン |
| `src/color/` | [`color/color.md`](color/color.md) | Color（0-1）/Color255（0-255）とその変換・パレット定数 |
| `src/input/` | [`input/input.md`](input/input.md) | InputHub、Keyboard/Mouse/MidiDevice |
| `src/tools/` | [`tools/tools.md`](tools/tools.md) | Recorder、lil-guiラッパー(GuiUtility)、5つの`*GuiController` |
| `src/scene/core/` | [`scene/core.md`](scene/core.md) | SceneGraph、SceneNode階層、Scene/RecordScene |
| `src/scene/transform/` `src/scene/camera/` | [`scene/transform-camera.md`](scene/transform-camera.md) | Transform（遅延ワールド行列計算）、Camera（透視/平行投影） |
| `src/scene/clock/` | [`scene/clock.md`](scene/clock.md) | ClockOperation→Clock、RealTimeClock/FixedTimeClock |
| `src/scene/light/` | [`scene/light.md`](scene/light.md) | Light値オブジェクト、LightConstants（Directional/Point/Ambient） |
| `src/scene/material/` | [`scene/material.md`](scene/material.md) | 15個の具象マテリアル。シェーダへのUniform供給を一手に担う層 |
| `src/scene/mesh/` | [`scene/mesh.md`](scene/mesh.md) | ジオメトリ+マテリアルを束ねて`gl.drawElements`する薄い実行レイヤー |
| `src/scene/factory/` | [`scene/factory.md`](scene/factory.md) | MaterialFactory、LightFactory |
| `src/scene/audio/` | [`scene/audio.md`](scene/audio.md) | AudioOutput、ExternalFileAudioInput、ShaderAudioInput（Transform Feedback） |
| `src/scene/renderer/` | [`scene/renderer.md`](scene/renderer.md) | レンダリングパイプライン全体（このプロジェクトで最も複雑なサブシステム） |
| `src/webgl/gl/` | [`webgl/gl.md`](webgl/gl.md) | Shader/Buffer/FBO/Geometry/Texture/Fontの低レベルラッパー層 |
| `src/webgl/shader/` | [`webgl/shader.md`](webgl/shader.md) | GLSLシェーダー本体24ファイル |

## 実装状況サマリー

README.md（プロジェクトルート）に記載の「次やること」「その後」「課題」を、今回のコード調査時点の実態と照らし合わせると:

| README記載の項目 | 現状 |
|---|---|
| マテリアルとジオメトリの精査と関係性の調整 | ジオメトリはFactory化されておらず`new`直接呼び出し、マテリアルのみ`MaterialFactory`経由という非対称は現在も残る（意図的な非対称、[`scene/factory.md`](scene/factory.md)参照） |
| 立方体など描けるジオメトリの種類を増やす | **`Box`ジオメトリは実装済み**（6面24頂点、`src/index.ts`からexport、`examples/sample.ts`で使用）。README作成時点では未着手だったと見られるが、現状は解消している（[`webgl/gl.md`](webgl/gl.md)参照） |
| ライティング | **大きく前進している**。`PhongMaterial`は平行光源・点光源（各最大8個）+環境光+`shininess`のuniform化に対応し、`AmbientLightNode`/`DirectionalLightNode`/`PointLightNode`の3種のライトノードが揃っている。ただし`GouraudMaterial`は単一光源のまま据え置き（[`scene/material.md`](scene/material.md)/[`scene/light.md`](scene/light.md)参照） |
| インスタンシング | 未着手（該当する実装はコード上に見当たらない） |
| UBOの情報のまとめ方 | `ShaderUniformBuffer`によるstd140アライメント計算・`GlobalUniforms`ブロックの自動バインドという現状の仕組みは動作しているが、`UniformBindingPoint`の`MATERIAL`/`OBJECT`/`LIGHT`/`DEBUG`は定義のみで未配線（[`webgl/gl.md`](webgl/gl.md)参照）——「これで良いか」という課題自体は未解決のまま |
| MIDIコントローラーの設計 | 未解決のまま。`MidiDevice`は受信側が`console.log`止まり・`isDown`/`isPressed`/`isReleased`は`false`固定のスタブ。一方でコンストラクタ内にLED点灯を試みる送信側の実験コードが存在するという非対称な状態（[`input/input.md`](input/input.md)参照） |

## `.claude/rules/`との既知の食い違い

今回、実際のソースコードを直接読んで各ドキュメントを作成する過程で、`.claude/rules/`配下の規約ドキュメントの一部が現状のソースと食い違っている（陳腐化している）ことが判明した。いずれも直近のライティング関連コミット（`ポイントライトを追加`／`PhongMaterialに輝度を追加`／`複数光源対応`／`AmbientLightの対応を追加`）以降にソース側が先行し、規約ドキュメントの更新が追いついていないパターン:

1. **`LightFactory`は空ファイルではない**（`operation-base.md`/`general.md`の記述）。実際は`light(color, intensity): Light`が実装され、`examples/sample.ts`から呼ばれている（[`scene/factory.md`](scene/factory.md)/[`scene/light.md`](scene/light.md)）。
2. **`Box`ジオメトリは未実装ではない**（`geometry.md`の記述）。6面24頂点で完全実装済み（[`webgl/gl.md`](webgl/gl.md)）。
3. **`RendererContext.setLights()`には呼び出し元がある**（`pipeline.md`の記述は「呼び出し元が存在しない」）。`examples/sample.ts`の`update()`が毎フレーム呼んでいる（[`scene/renderer.md`](scene/renderer.md)）。
4. **`PhongMaterial`は単一光源前提ではない**（`material.md`の記述）。平行光源・点光源（各最大8個）+環境光に対応済み（[`scene/material.md`](scene/material.md)）。
5. **`AmbientLightNode`が`node.md`に未記載**。`PointLightNode`/`DirectionalLightNode`と並ぶ3つ目の`LightNode`具象クラスとして存在する（[`scene/core.md`](scene/core.md)）。
6. **`.claude/CLAUDE.md`のポストエフェクトチェーン例（「Bloom→Bright→横Blur→縦Blur→GrayScale→Mosaic→RGBShift→Glitch」）は現状と不一致**。現在の`examples/sample.ts`はBloom関連の配線一式がコメントアウトされ、ポストエフェクトなしの最小構成で動いている（[`scene/renderer.md`](scene/renderer.md)）。
7. **ファイル名/クラス名の不一致を新規発見**: `flow/FinalBlitRenderFlow.ts`のクラス名は`FinalBlitRendererFlow`（"er"が1つ欠落）。`general.md`の「ファイル名とクラス名は1:1で完全一致する」という規約からの逸脱で、`flow.md`には記録されていない（[`scene/renderer.md`](scene/renderer.md)）。

これらは本ドキュメント（`docs/`）側では現状のソースに基づいて訂正済みだが、`.claude/rules/`および`.claude/CLAUDE.md`自体はまだ更新されていない。`.claude/rules/`を一次情報源として動く各種SKILL（`glspinner-design`/`glspinner-review`等）の判断に影響しうるため、`glspinner-conventions`（規約更新）・`glspinner-document`（CLAUDE.md更新）でのフォローアップを推奨する。

## 関連ドキュメント

- `.claude/rules/` — Claude Code向けのコーディング規約・設計パターンのカタログ（クラスファミリー単位）。本ドキュメントより粒度が細かく、「新しいコードをどう書くべきか」に主眼がある。
- `.claude/CLAUDE.md` — Claude Code向けのプロジェクトエントリーポイント（コマンド一覧、編集範囲の制限等）。
- プロジェクトルートの`README.md` — 利用方法、今後の予定、既知の課題（簡潔な箇条書き）。
