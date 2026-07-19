# `XxxOperation` + `BaseXxx` 二層構造（メタパターン）

glspinnerを貫く最大の設計規約。ほとんどのサブシステムが「`XxxOperation`インターフェースで契約を定義 → `BaseXxx`抽象クラスで共通実装を提供 → 具象クラスが差分のみ実装」という三段構成を取る。個別ファミリー固有の内容は`material.md`/`device.md`/`node.md`/`mesh.md`/`pipeline.md`/`pass.md`/`flow.md`/`buffer.md`/`geometry.md`/`render-target.md`/`vector-matrix.md`を参照し、このファイルはパターンそのものの適用基準と、パターンから外れる小規模ファミリーの扱いをまとめる。

## 適用する場面 / しない場面

- **適用する場面**: アプリケーション全体から見て「差し替え可能なサブシステムの入口」となるクラス。状態を持ち、DIやモック差し替えの対象になりうるものが対象（Application, Mesh, Material, Geometry, Buffer, RenderTarget, RendererFlow, ShaderPass, Deviceなど）。
- **適用しない場面**: 静的メソッドのみを持つユーティリティ（`MathUtility`, `VectorCalculator`）や、値の集合を定義するだけの`Constants`ファイルには`Operation`/`Base`構造を適用しない。
- 新規サブシステムを追加するときにこのパターンを使うべきか迷ったら「バリエーションが今後増える見込みがあるか」「差し替え可能性が必要か」を軸に考える（詳細判断は`glspinner-design`スキル）。

## 標準形

```ts
export interface XxxOperation {
    // 契約: 具象クラスが必ず実装するメソッド群
}

export abstract class BaseXxx implements XxxOperation {
    protected /* 共通フィールド */;
    // 共通実装があればここに書く。無ければ abstract 宣言のみで次段に委ねる。
    abstract someMethod(): void;
}

export class ConcreteXxx extends BaseXxx {
    // 差分のみ実装
}
```

`BaseXxx`が実際に共通ロジックを提供するか、単に`abstract`宣言をまとめるだけの薄い層かはファミリーごとに差がある（例: `BaseGeometry`はVAO管理などの共通実装を持つが、`BaseDevice`は共通ロジックを持たず具象クラスが`isDown`/`isPressed`/`isReleased`をそれぞれ独自実装している。詳細は`device.md`）。新規ファミリーを設計する際、共通実装を`Base`に持たせるか具象クラスに委ねるかは、既存の類似ファミリーの実例に合わせて判断する。

## Factory/Loaderパターンとの関係

`ShaderLoader`/`TextureLoader`/`TextFontLoader`のように「`Map`によるキャッシュを持つLoader」を複数束ねて「キー名から生成物を組み立てる」役割（`MaterialFactory`）には、`Operation`/`Base`ではなくFactory/Loaderパターンを使う。単純に`new`すれば済むもの（Geometry, Meshの生成など）は現状Factory化されておらず、アプリ側（`setup()`）で直接インスタンス化するスタイルになっている（これは既知の未整理ポイントであり無理に統一しない）。

## パターンから外れる小規模ファミリー（`Base`接頭辞を使わない例外）

以下は`XxxOperation`インターフェースを持つが、`BaseXxx`という中間の抽象クラスを挟まない、または挟み方が変則的な小規模ファミリー。専用ファイルを割くほどの具象クラス数がないため、ここにまとめて記録する。新たにこの系統へクラスを追加する場合は、無理に`BaseXxx`層を新設せず、既存の変則パターンに合わせるかユーザーに確認する。

`~Application`（`application.md`）と`~Clock`（`clock.md`）は元々ここに含まれていたが、それぞれ具象クラス・中間抽象クラスを含む規模がまとまった分量になったため独立ファイル化した。以下に残っているのは、今のところ独立ファイル化するほどの規模がない2系統のみ。

- **Scene系**（`src/scene/core/`）: `SceneOperation` → `Scene`と`RecordScene`が**共通の抽象クラスを介さず、それぞれ直接`SceneOperation`をimplementsする**兄弟クラス。中間の抽象化層自体が存在しない、この規模のファミリーとしては珍しいパターン。`Scene`は通常の`requestAnimationFrame`ループを回す標準実装。`RecordScene`は代わりに`record(fps, frameNum)`で`for`ループ+`setTimeout`delayを使い、決め打ちフレーム数を強制的に順次処理する非リアルタイム実行用のシーンクラス（アニメーションの書き出し用途、`application.md`の`RecordingApplication`と対で使われる）。両クラスとも`~Clock`（`clock.md`）を`private clock: ClockOperation`として1つ保持し、`shouldDraw()`による間引き描画のロジックは実装されているが`Scene.run()`側では現状コメントアウトされ、毎フレーム無条件にupdate/drawしている（一般規約`general.md`の「無効化中のimport」と同種の、意図的に無効化されたまま残っているコード）。
- **Light系**（`src/scene/light/`、`LightNode`系とは別物）: `LightOperation` → `Light`（**abstractではなく具象クラス**が直接implementsする、かつ兄弟クラスがいない単独実装）。ライトのノード表現（`LightNode`/`PointLightNode`/`DirectionalLightNode`）は`node.md`が扱う別ファミリーで、こちらはライトのデータそのもの（色・強度など）を表す値オブジェクト。

これらの変則パターンは「間違い」ではなく、ファミリーの規模（具象クラスが1〜2個しかない）に対して`BaseXxx`層を作るほどの重みがないと判断された結果と考えられる。同程度の小規模な新規ファミリーを追加する場合、無理に`BaseXxx`を新設するより、この変則パターンに倣う方が既存コードとの一貫性が高い場面もある。
