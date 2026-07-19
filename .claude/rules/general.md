# glspinner 横断規約（クラスファミリー非依存）

> `.claude/rules/`配下のファイルは、SKILL/commandではなくプレーンな参照ドキュメント。各SKILLの実行手順から明示的に読みに行く前提で、frontmatterは付けない。
> 以前は`claude_io/design.md`という別ファイルにアーキテクチャ解説を置いていたが、内容的に「規約」と地続きのため`.claude/rules/`へ統合し、`design.md`は廃止した（詳細は本ファイル末尾の変更履歴）。

## プロジェクト概要

`glspinner`はSpinnerEddy氏によるWebGL practicing用ツール（`package.json`の`description`: "SpinnerEddy's tool made for practicing WebGL"）。WebGL2をベースに、シーングラフ・レンダリングパイプライン（ポストエフェクトチェーン込み）・マテリアル/メッシュ・入力デバイス（キーボード/マウス/MIDI）・オーディオ入力・録画（フレームキャプチャ）・GUIデバッグツール（lil-gui）を備えた、Three.js的なミニ自作WebGLフレームワーク。

- ビルド: Vite（`vite build`）+ TypeScript型定義バンドル（`rollup-plugin-dts`）。ライブラリとして`dist/spinnergl-lib.*.js`を出力し、`src/index.ts`が公開APIのバレルファイル。
- テスト: Jest（`tests/`にmath/color系のユニットテストのみ存在。詳細は`glspinner-test`スキル）。
- README記載の「次やること」（マテリアル/ジオメトリ関係の整理、ライティング拡張、MIDIコントローラー設計）が現在進行中の課題。

## ディレクトリ構成と責務マップ

```
src/
├── app/            アプリケーションのライフサイクル基底クラス（application.md参照）
├── color/           Color(0-1)/Color255/ColorUtility などの色表現
├── math/            Vector2-4, Matrix22-44, Quaternion と各種Calculator/Utility（vector-matrix.md参照）
├── input/           デバイス抽象化(Keyboard/Mouse/Midi) + InputHub（device.md参照）
├── tools/           Recorder（フレーム録画）, gui/ 配下の lil-gui コントローラー群（tools.md参照）
├── scene/
│   ├── core/        Scene(ループ制御), SceneGraph, SceneNode階層（node.md参照）
│   ├── transform/   Transform（位置・回転・スケール・行列計算）
│   ├── camera/      Camera（Perspective/Orthographic）
│   ├── clock/       Clock抽象 + RealTimeClock/FixedTimeClock（clock.md参照）
│   ├── light/        Light, LightConstants, LightOperation（operation-base.md「Light系」参照）
│   ├── audio/        AudioOutput, ExternalFileAudioInput, ShaderAudioInput（audio.md参照）
│   ├── material/     BaseMaterialと各種サブクラス（material.md参照）
│   ├── mesh/         BaseMeshと各種サブクラス（mesh.md参照）
│   ├── factory/       MaterialFactory（LightFactoryは現状空ファイル）
│   └── renderer/
│       ├── RendererContext.ts    フレーム単位の共有状態（pipeline.md参照）
│       ├── definition/           RenderTag（描画レイヤー分類、pipeline.md参照）
│       ├── flow/                  Standard/PostEffect/FinalBlit の各レンダーフロー（flow.md参照）
│       ├── pipeline/              SceneRendererPipeline（フロー全体のオーケストレーション、pipeline.md参照）
│       ├── postEffect/            BaseShaderPassと各種ポストエフェクトパス（pass.md参照）
│       └── context/               RenderTargetRegistry（FBOプール管理、render-target.md参照）
└── webgl/
    ├── gl/          WebGL2の薄いラッパー層（Shader, Buffer, FBO, Geometry, Texture, Font, Uniform, Attribute。buffer.md/geometry.md/render-target.md参照）
    └── shader/      GLSLシェーダー本体（*.vert/*.frag、shader.md参照）
```

## この文書について

glspinnerには `.eslintrc` も `.prettierrc` も存在せず、`package.json` の `scripts` にもlint/format系のコマンドは定義されていない（`dev`/`dev:lib`/`build`など7スクリプトのみ）。つまり自動整形・自動検査による強制力は一切なく、「規約」は既存コードの書き方そのものが実質的な一次情報源になっている。

規約は`.claude/rules/`配下に、クラスファミリー（接頭辞・接尾辞を共有するクラス群、例: `~Material`, `~Device`, `Base~`）ごとにファイルを分割して置いている。このファイルはどのファミリーにも属さない横断的な規約のみを扱う。特定ファミリー固有の規約（命名パターン、共通メソッドシグネチャ、既知の例外）はそのファミリーのファイル（`material.md`, `device.md`, ...）を参照すること。`XxxOperation`インターフェース + `BaseXxx`抽象クラスという二層構造そのものの適用可否・適用ルールは`operation-base.md`を参照。

ファミリーを持たない一回限りのクラス（`MathUtility`, `ColorUtility`, `ShaderLoader`/`TextureLoader`/`TextFontLoader`, `MaterialFactory`, `ShaderProgram`, `ShaderAttribute`, `ShaderUniform`, `WebGLUtility`など）は、専用のファミリーファイルを持たず、以下の横断規約のみに従う。`Camera`/`Transform`/`SceneGraph`は`node.md`、`Recorder`/`*GuiController`は`tools.md`で、それぞれ関連する周辺クラスとして扱う。

### ファミリーファイル一覧（2026-07時点）

対象クラスの接頭辞・接尾辞に応じて該当ファイルを読む。一覧の追加・変更は`glspinner-conventions`スキルが担当する。

- `operation-base.md` — `XxxOperation`+`BaseXxx`二層構造のメタパターン、Factory/Loaderとの使い分け、標準形から外れる小規模ファミリー（Scene/Light）
- `application.md` — `~Application`（`BaseApplication`/`RecordingApplication`の2段中間抽象クラス）
- `clock.md` — `~Clock`（`ClockOperation`→`Clock`という`BaseClock`ではない命名の抽象クラス）
- `material.md` — `~Material`
- `device.md` — `~Device`
- `node.md` — `~Node`
- `mesh.md` — `~Mesh`
- `pipeline.md` — `~Pipeline`
- `pass.md` — `~Pass`（ShaderPass）
- `flow.md` — `~Flow`（RendererFlow）
- `buffer.md` — `~Buffer`
- `geometry.md` — `~Geometry`系（`Plane`/`Torus`等）
- `render-target.md` — `~RenderTarget`
- `vector-matrix.md` — `Vector`/`Matrix`系（自己参照ジェネリクスの独自パターン）
- `audio.md` — `AudioOutput`/`AudioInputOperation`系
- `tools.md` — `Recorder`、`GuiUtility`、`*GuiController`系（静的クラス+`initialize()`パターン）
- `shader.md` — `src/webgl/shader/`配下のGLSLシェーダー（TypeScriptのクラス構造とは無関係な唯一のファミリー）

## 命名規則

- **クラス名**: PascalCase。ファイル名とクラス名は1:1で完全一致する（例: `MeshNode.ts` → `class MeshNode`、`ShaderProgram.ts` → `class ShaderProgram`）。
- **private/protectedプロパティ**: アンダースコア接頭辞は使わない。`this.program`, `this.buffer`, `this.devices`, `this.currentInput` のように素の名前で統一されている（`_xxx`形式の例は見当たらない）。
- **boolean値**: `is`接頭辞で統一（`isRunning`, `isDown`, `isPressed`, `isReleased`, `isRequiredRecalculation`, `isVertical`, `isCurrentShaderProgramSame`）。`has`接頭辞も許容する。
- **定数オブジェクト → Union型導出パターン**: `export const XxxConstants = {...} as const;` で値の集合を定義し、`export type Xxx = typeof XxxConstants[keyof typeof XxxConstants];` でUnion型を導出する形が頻出（`RenderTagConstants`/`RenderTag`, `RenderTargetSlot`/`RenderTargetSlotKey`, `MouseButton`/`MouseButtonType`, `KeyboardCode`/`KeyboardCodeType`）。新しい定数集合を追加するときはこの形に合わせる。`Constants`接尾辞の有無自体は揺れている（後述）。
- **メソッド名**: camelCase。ジェネリクスを使う静的ユーティリティ（`VectorCalculator`, `MathUtility`）も含め一貫。
- **クラスファミリー固有の命名**（`XxxOperation`/`BaseXxx`/具象クラスの接頭辞・接尾辞ルールなど）は`operation-base.md`および各ファミリーファイルを参照。

## フォーマット（インデント・空白・改行・セミコロン等）

- **インデント**: 半角スペース4つが基本。ただし`src/scene/mesh/UnlitMesh.ts`（18行目）にタブ混入が1箇所あり、完全には統一されていない。
- **セミコロン**: 文末には基本的に付ける。ただし`throw new Error(...)`の直後などでセミコロンが抜けている箇所が散見される（例: `src/math/vector/Vector2.ts`105行目）。強制されているわけではない。
- **クォート**: `import`文のモジュールパスは二重引用符（`"../foo"`）、それ以外の文字列リテラル（エラーメッセージ、イベント名`'keydown'`、シェーダキー名`'vert'`/`'frag'`等）は単一引用符、という使い分けがかなり一貫して観察できる。
- **アクセス修飾子**: `private`/`protected`/`abstract`は常に明示する。一方で`public`は明示するクラス（`SceneNode`, `Scene`, `ShaderProgram`など）と省略するクラス（`InputHub`, `UnlitMaterial`, `SimpleMesh`の各オーバーライドメソッドなど）が混在しており統一されていない。
- **空行**: import群とクラス宣言の間に空行1つ。メソッドとメソッドの間にも空行1つ。コンストラクタ内のプロパティ初期化はまとめて隣接して書く。
- **1行の長さ**: 明確な上限ルールは見当たらない。`MaterialFactory`の長めのメソッドシグネチャなども折り返さず1行に収めている。

## import / ファイル配置

- **相対パス**: `src/`内は一貫して相対パス（`../../webgl/gl/...`等）。パスエイリアス`@/`は`tests/`側の`jest.config.ts`（`moduleNameMapper`）にのみ定義されており、`src/`内での使用例はない。
- **importの並び順**: インポート元のモジュールパス文字列をアルファベット順に近い形で並べる傾向がある（`MaterialFactory.ts`の21個のimportが綺麗にソートされている）。手作業というよりエディタの自動整列に近い規則性。
- **ファイル配置**: 基本は1ファイル1クラス（またはインターフェース）。例外として`InputConstants.ts`や`RenderTargetConstants.ts`、`LightConstants.ts`のような「Constants」ファイルには複数の`const`/`type`定義がまとめて置かれる。
- **無効化中のimport**: 未使用/未接続の機能はimport自体をコメントアウトして残す（`src/input/InputHub.ts`の`// import { MidiDevice } from "./device/MidiDevice";`）。削除せず「今は繋いでいない」ことをコード上に残す運用。

## コメント・ドキュメンテーション方針

- **JSDoc**: `src/`全体を検索してもJSDocコメント（`/** ... */`）は1件も見つからない。関数・クラスの説明コメントを書く慣習自体が存在しない。
- **コメントの用途**: ほぼ以下の2パターンに限られる。
  1. 区切りコメント（`// --- Alphabet ---`など、`InputConstants.ts`のキーコード一覧を視覚的に区切る用途）。
  2. 一時的に無効化したコードを消さずに残す用途（`Scene.run()`内でコメントアウトされた`shouldDraw()`分岐、`InputHub`のMidiデバイス関連行）。
- 新規コードでも、自明な処理に説明コメントを付ける慣習はない。無効化する場合は削除せずコメントアウトで残す、という既存の運用に合わせるのが無難。

## 未解決・揺れがある事項

以下は「どちらかに統一する」と判断せず、揺れとして記録するに留める。多数派を暫定ルールとして採用するかはユーザー判断を仰ぐこと。

1. **等価比較演算子（`==`/`!=` vs `===`/`!==`）が混在**: 初版整理時は「`==`/`!=`に一貫している」と判断したが、その後`.claude/rules/`への分割整理でファイルを読み直したところ、`SceneNode.ts`は同一ファイル内で`==`/`!=`（49, 51, 55行目）と`===`/`!==`（23, 29, 57-59, 66行目）の両方を使っており、`RenderTarget.ts`は`===`/`!==`（38, 53行目）を使っている。実態は「多数派は`==`/`!=`だが、`===`/`!==`も広く混在しており厳密な規約ではない」というのが正確。新規コードでどちらを使うかは、少なくとも触っている既存ファイル内の書き方に合わせること（ファイル単位で統一されていることが多い）。プロジェクト全体を`===`に寄せる、あるいは`==`に統一するという判断はユーザー確認なしに行わない。
2. **`public`アクセス修飾子の明示/省略が混在**（`SceneNode`/`Scene`は明示、`InputHub`/`UnlitMaterial`/`SimpleMesh`は省略）。
3. **セミコロンの付け忘れが散発**（特に`throw new Error(...)`の直後）。強制する仕組みがないため今後も混入し得る。
4. **インデントへのタブ混入が1箇所**（`src/scene/mesh/UnlitMesh.ts`18行目）。他は全てスペース4つ。
5. **`Constants`接尾辞の有無が不統一**: `RenderTagConstants`/`ValueConstants`/`RenderTargetConstants`は接尾辞ありだが、同じ「定数オブジェクト→Union型導出」パターンでも`DeviceName`/`MouseButton`/`KeyboardCode`（`InputConstants.ts`）は接尾辞なし。
6. **getter/setter方式の混在**: `Vector2`などは`get x()`/`set x()`のアクセサ形式、`Transform`など他クラスは`getXxx()`/`setXxx()`のメソッド形式。どちらを使うべきかの一貫した基準は読み取れなかった。詳細は`vector-matrix.md`参照。

## 変更履歴

- 2026-07-19: 初版作成（`claude_io/coding-conventions.md`として）。`claude_io/design.md`と`src/math`, `src/scene/core`, `src/scene/material`, `src/scene/mesh`, `src/webgl/gl`, `src/input`, `src/app`, `src/scene/factory`配下のサンプルコードから規約を抽出。
- 2026-07-19: `.claude/rules/`配下へ移行し、クラスファミリー単位でファイル分割。本ファイルは横断規約のみを残し、ファミリー固有の内容は`operation-base.md`および各ファミリーファイルへ切り出した。移行の過程で`SceneNode.ts`/`RenderTarget.ts`を読み直し、等価比較演算子の「揺れ」の実態が初版の記述より大きいことが判明したため上記1を更新。`claude_io/coding-conventions.md`は廃止。
- 2026-07-19: `claude_io/design.md`（アーキテクチャ解説）の内容を「規約に近い」との判断で`.claude/rules/`へ統合し、`design.md`を廃止する方針を決定。本ファイルにはプロジェクト概要とディレクトリ構成と責務マップ（旧design.md第1-2章）を追加。アプリケーションライフサイクル・SceneGraph周辺・RendererContext・Factory詳細・InputHubは各該当ファイルへ、オーディオ（`AudioOutput`/`AudioInputOperation`）とツール群（`Recorder`/`GuiUtility`/`*GuiController`）はそれぞれ新規`audio.md`/`tools.md`へ切り出した。
- 2026-07-19（追記）: 上記の方針決定時点では実際には`claude_io/design.md`ファイルの物理削除が漏れており、記録と実態が食い違ったまま残っていた。改めて全10章を読み直して内容の再突き合わせを行い、`ShaderProgram.createProgram()`がリンク後に`GlobalUniforms`という名前のUniform Blockを検出して`UniformBindingPoint.GLOBAL`へ自動バインドする挙動（design.md第6章に記載、rules未収録だった）を`buffer.md`「UBO専用の`ShaderUniformBuffer`」節へ追記。他の章は既に`.claude/rules/`各ファイルへ反映済みであることを確認した（design.md第6章が`Box`ジオメトリを実装済みとして触れているのは`geometry.md`の記述と食い違っており、`Box.ts`は中身が空のプレースホルダファイルのため`geometry.md`側の「未実装」という記述を正とした）。CLAUDE.mdの「詳細な設計リファレンス」節と、`flow.md`/`operation-base.md`内の`claude_io/design.md`への参照を除去した上で、`claude_io/design.md`を物理削除。あわせて、design.md統合の過程でも参照が残っていた各SKILL.md（`glspinner-design`/`glspinner-document`/`glspinner-ideation`/`glspinner-reading`/`glspinner-review`/`glspinner-task-discovery`/`glspinner-implement`）と共通command`glspinner-context.md`のdesign.md参照も`.claude/rules/`参照へ書き換えた。
- 2026-07-19（追記2）: ユーザー指定により`operation-base.md`「小規模ファミリー」節にまとめられていたApplication系・Clock系を独立ファイル化。`src/app/`（`ApplicationOperation`→`BaseApplication`→`RecordingApplication`という2段中間抽象クラス構成、コンストラクタでの`SceneOperation`外部注入、利用者側`src/`外での具象化）を`application.md`へ、`src/scene/clock/`（`ClockOperation`→`Clock`という`BaseClock`ではない命名の、共通実装が濃い抽象クラス）を`clock.md`へそれぞれ新規作成。`operation-base.md`側は該当2ブロックを削除し、Scene系の記述に`RecordScene`の非リアルタイム実行の詳細（元はApplication系ブロックにあった）を統合した上で新2ファイルへの導線を追加。本ファイルのファミリーファイル一覧索引とディレクトリ構成マップ内の参照リンクも更新。
- 2026-07-19（追記3）: `src/webgl/shader/`配下のGLSLシェーダー24ファイル（`examples/shader/`の4ペアはサンドボックス用途のため対象外）を実際に読み込み、新規`shader.md`を作成。TypeScriptの`XxxOperation`+`BaseXxx`パターンとは無関係な、GLSLファイル集合という初のクラス構造非依存ファミリー。`aXxx`/`vXxx`命名やGlobalUniformsブロックの完全一致コピーといった多数派パターンに加え、`blur.frag`のタブ混入・独自main()シグネチャ・Allman brace styleや、`gouraudLighting`/`phongLighting`がGlobalUniformsを使わない構造的な例外など、コピペで蓄積した揺れを正直に記録した。`ShaderLoader`のファイル名キー化・`ShaderProgram`の`GlobalUniforms`マジックストリングは規約ではなく実装上の制約として区別して記載。本ファイルのファミリーファイル一覧索引とディレクトリ構成マップ（`webgl/`配下を`gl/`と`shader/`に分割）も更新。
