---
name: glspinner-test
description: glspinnerのJest（ts-jest）テストを、tests/配下の既存構成・命名パターン（例: XxxTest.ts、srcのディレクトリ構造をtests/配下にミラーする）に沿って追加・修正する。math/color系などの純粋ロジックが主対象で、WebGLコンテキストに依存するコード（webgl/gl/、scene/renderer/）はユニットテスト化しづらい旨を踏まえて方針を示す。「テストを書いて」「このロジックのテストを追加して」「テストが通るか確認して」といった依頼が来たら必ずこのスキルを使う。
---

# glspinner-test

## このスキルの立ち位置

glspinnerのテストは`tests/`配下にJest（`ts-jest`、`jest.config.ts`）で構築されており、現状は`tests/math/`・`tests/color/`・`tests/scene/`（`SceneGraphNodeIdGeneratorTest.ts`のみ）に限られる。これは偶然ではなく、**WebGL2のコンテキストに依存するコード（`webgl/gl/`のラッパー層、`scene/renderer/`のパイプライン・ポストエフェクト等）はブラウザ実行が前提でNode環境のJestでは素直にテストしづらい**という構造的事情がある（`testEnvironment: 'node'`）。このスキルは「テストできるものはきちんとテストする」「テストしづらいものは別の検証手段に誘導する」の両方を担当する。

## 実行手順

### 1. 対象がユニットテスト向きかを判定する

- **テスト向き**: 純粋なロジック・計算・データ変換（`math/`のCalculator/Utility系、`color/`、IDジェネレータのような副作用の少ないユーティリティなど）。DOM/WebGLコンテキストに依存しない。
- **テストしづらい**: `webgl/gl/`のラッパー層、`scene/renderer/`のパイプライン・シェーダーパス、GUI（`tools/gui/`）、`AudioOutput`等のWeb Audio API依存コード。これらはモックで固めるとテストのためのテストになりやすく、`.claude/rules/`や既存の`tests/`構成にもその種のテストは存在しない。

対象が後者の場合は、無理にユニットテストを書こうとせず、その旨をユーザーに伝えた上で `run`/`verify` スキル（ブラウザで実際に動かして目視確認する）を代替手段として案内する。ユーザーがそれでもモックを使ったテストを望む場合はその指示に従う。

### 2. 既存パターンに合わせてテストを配置する

- 配置場所: `tests/`配下で`src/`のディレクトリ構造をミラーする（例: `src/math/MathUtility.ts` → `tests/math/MathUtilityTest.ts`）。
- ファイル名: 既存は`XxxTest.ts`（`Xxx.test.ts`ではない）という命名。`jest.config.ts`の`testMatch`は`tests/**/*.ts`全体にマッチするため厳密な制約ではないが、既存ファイルと揃える。
- import: 既存テストは相対パス（`../../src/...`）でsrcを参照している。`jest.config.ts`には`@/`エイリアス（`moduleNameMapper`）が定義されているが、既存テストコードでは使われていない。既存パターンに合わせて相対パスを使う（`.claude/rules/general.md`のimportに関する記述と合わせて確認する）。
- 書き方: `describe`でグルーピングせず`test("説明", ...)`をフラットに並べるのが既存の流儀（例: `MathUtilityTest.ts`）。境界値（`clamp`の上限/下限/範囲内など）を複数の`test`に分けて書く既存スタイルを踏襲する。

### 3. テストの実行

`npm test`（Jest全体）または `npx jest tests/xxx/XxxTest.ts`（対象ファイルのみ）で実行し、パスすることを確認する。既存の他テストを壊していないかも確認するため、変更範囲が広い場合は`npm test`をフルで回す。

### 4. 完了後

追加・変更したテストファイルと、テスト対象のうちユニットテスト化を見送った部分（あれば理由込みで）を報告する。
