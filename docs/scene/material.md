# scene/material — シェーダへのUniform供給を担うマテリアル層

## 概要

`src/scene/material/`は、ジオメトリに対する「見た目の計算方法」を表すレイヤー。`MaterialOperation`インターフェース→`BaseMaterial`抽象クラス→15個の具象クラスという`Operation+Base`パターンの典型例で、通常の3D描画用マテリアル7種とポストエフェクト用マテリアル8種に大別される。各マテリアルの責務は「自分が使うシェーダプログラムに対して、必要なUniformをすべて設定すること」に限定されており、頂点・インデックスデータ自体は`scene/mesh`と`webgl/gl/geometry`側が持つ。

## 主要クラス一覧

| クラス/ファイル | 役割 | 備考 |
|---|---|---|
| `MaterialOperation.ts` | 契約インターフェース | `use`/`getAttribute`/`setUniform`/`cleanup`の4メソッド |
| `BaseMaterial.ts` | 抽象基底 | `use`/`getAttribute`/`cleanup`を共通実装、`setUniform`のみ`abstract` |
| `UnlitMaterial.ts` | ライティングなしの単色描画 | `modelMatrix`のみ設定する最小構成 |
| `TexturedMaterial.ts` | テクスチャ貼り付け | `cleanup()`でテクスチャをアンバインド |
| `PhongMaterial.ts` | フォンシェーディング（フラグメント単位） | 複数光源（Directional/Point/Ambient）に対応、自己完結型 |
| `GouraudMaterial.ts` | グーローシェーディング（頂点単位） | ライトはコンストラクタ引数+setterで保持（単一光源想定） |
| `FragmentCanvasMaterial.ts` | 任意フラグメントシェーダのキャンバス化 | `customUniforms`という汎用Mapを持つ |
| `FrameBufferTexturedMaterial.ts` | オフスクリーンRTの内容をそのまま描画 | `CURRENT_FRAME`スロット固定 |
| `TexturedTextMaterial.ts` | テキストレンダリング用 | フォントアトラステクスチャ + SDF風`smoothness`パラメータ |
| `GrayScaleMaterial.ts` | ポストエフェクト: グレースケール化 | パラメータなし |
| `MosaicMaterial.ts` | ポストエフェクト: モザイク | `mosaicSize`をsetterで調整可 |
| `RGBShiftMaterial.ts` | ポストエフェクト: RGBずらし | `shiftOffset` |
| `GlitchMaterial.ts` | ポストエフェクト: グリッチ | `glitchCoef` |
| `BlurMaterial.ts` | ポストエフェクト: ガウシアンブラー（片方向） | `MathUtility.calculateGaussianCoefficients()`でカーネル係数を事前計算 |
| `BrightMaterial.ts` | ポストエフェクト: 輝度抽出（Bloom用） | `brightThreshold` |
| `ComposeMaterial.ts` | ポストエフェクト: ブルーム合成 | `tex`（現フレーム）+`brightTex`（ブラー済み輝度）の2テクスチャを合成 |
| `MaskMaterial.ts` | ポストエフェクト: マスク処理 | パラメータなし、`shaderKey`を外から差し替えて汎用マスクとして使う |

## アーキテクチャ・設計パターン

`BaseMaterial`が共通化するのは「同一シェーダプログラムなら再バインドしない」(`use()`)・属性取得(`getAttribute()`)・空実装の`cleanup()`のみで、`setUniform(gl, context, transform)`だけが具象クラスの責務。この`setUniform`の第3引数`transform: Transform`は、以前存在した`RendererContext.globalUniforms`という可変の共有辞書を廃止した結果として導入されたもの——複数ノードを跨いだ書き込み順序に依存し「値が1描画分遅延して送られる」という実バグを踏まえたリファクタで、現在の`RendererContext`はもはやUniform辞書を持たず、`camera`/`lights`/`globalUniformBuffer`(UBO)/`currentShaderProgram`/`renderTargetRegistry`/`activateRenderTag`のみを保持する。各マテリアルは必要な値を`transform`引数と`context.getCamera()`/`context.getLights()`から自己完結して取得する。

パラメータを持たないマテリアル（`UnlitMaterial`/`GrayScaleMaterial`/`MaskMaterial`等）は`modelMatrix`（と必要ならテクスチャスロット）を送るだけの数行構成。調整パラメータを持つポストエフェクト系マテリアルは「コンストラクタ引数 + 型付き`setXxx()`」という統一パターンを取り、`ShaderUniformValue`によるラップは`setUniform()`内でGL呼び出し直前にのみ行う（フィールド自体は素の`number`等のドメイン型で保持する）。

`FragmentCanvasMaterial`だけは事情が異なり、任意のユーザー定義フラグメントシェーダと組み合わせる前提のため、固定名のsetterではなく`customUniforms: UniformPairs`（`Record<string, ShaderUniformValue>`）という任意キー受け付け構造と`setCustomUniform(key, value)`を持つ。ページ全体で共有される可変辞書ではなく、そのマテリアルインスタンス1つに閉じたMapである点が重要（他ノード・他フレームとの値の取り違えを避けつつ柔軟性を残す）。

## 主要クラス詳細

### `PhongMaterial`（自己完結型・複数光源対応）

```ts
setUniform(gl, context, transform): void {
    const modelMatrix = transform.getWorldMatrix();
    const invertMatrix = modelMatrix.inverse();
    const eyeDirection = context.getCamera().calculateEyeDirection();
    // modelMatrix / invMatrix / eyeDirection / shininess を送信
    if (context.getLights().length == 0) return;
    this.setLightUniforms(gl, context.getLights());
}
```

- `modelMatrix`/`invMatrix`（法線変換用の逆行列）/`eyeDirection`（`Camera.calculateEyeDirection()`）/`shininess`（コンストラクタ引数、`setShininess()`で変更可）を自己計算して送信する。
- `context.getLights()`から取得した`LightParams[]`を`setLightUniforms()`が`LightType`（`Directional`/`Point`/`Ambient`、`src/scene/light/LightConstants.ts`）ごとにフィルタし、`setDirectionalLightUniforms`/`setPointLightUniforms`/`setAmbientLightUniform`の3メソッドへ振り分ける。Directional/Pointはそれぞれ配列Uniform（`directionalLights[i].direction/color/intensity`等）+件数Uniform(`directionalLightCounts`)を送り、Ambientは複数光源があれば`color * intensity`を合算して単一の`ambientLightColor`にまとめる。
- 単一光源前提だった旧実装から、複数光源・複数種別（Directional/Point/Ambient）対応へ拡張済み（`MAX_DIRECTIONAL_LIGHTS`/`MAX_POINT_LIGHTS`は共に8）。

### `GouraudMaterial`（コンストラクタ引数+setter型・単一光源）

`PhongMaterial`とは異なり、ライトを`context.getLights()`から取得せず、コンストラクタ引数（`lightDirection`/`eyeDirection`/`ambientColor`）+`setLightDirection()`/`setEyeDirection()`/`setAmbientColor()`という旧来のsetterパターンで保持し続けている。`PhongMaterial`と完全に同じ自己完結方針を採るかどうかは意図的に据え置かれた状態（両者の非対称性はこのファミリーの既知の揺れ）。

### `FragmentCanvasMaterial`

```ts
private customUniforms: UniformPairs = {};
setUniform(gl, _context, transform): void {
    this.shaderProgram.setUniform(gl, 'modelMatrix', ...);
    Object.entries(this.customUniforms).forEach(([key, value]) => {
        this.shaderProgram.setUniform(gl, key, value);
    });
}
setCustomUniform(key: string, value: ShaderUniformValue): void { this.customUniforms[key] = value; }
```

任意のシェーダキーに対応する汎用キャンバス。`examples/`でシェーダ実験をする際の入口として使われる想定。

### ポストエフェクト系マテリアル共通パターン（`MosaicMaterial`が典型例）

```ts
export class MosaicMaterial extends BaseMaterial {
    private mosaicSize: number;
    constructor(shaderProgram, mosaicSize: number) { super(shaderProgram); this.mosaicSize = mosaicSize; }
    setUniform(gl, _context, transform): void {
        // modelMatrix, mosaicSize, tex(=TextureSlot.CURRENT_FRAME) を送信
    }
    setMosaicSize(mosaicSize: number): void { this.mosaicSize = mosaicSize; }
}
```

`RGBShiftMaterial`（`shiftOffset`）、`GlitchMaterial`（`glitchCoef`）、`BrightMaterial`（`brightThreshold`）、`ComposeMaterial`（`bloomStrength`）も同型。`BlurMaterial`だけやや複雑で、コンストラクタで`MathUtility.calculateGaussianCoefficients(blurRange, 32)`によりガウシアンカーネル係数（32要素）を事前計算し`gCoefficients`として送信、`isVertical`フラグで水平/垂直どちらのブラーかを`blurDirection`(int)として送る。

## 他モジュールとの関係

- **`scene/factory` (`MaterialFactory`)**: すべての具象マテリアルは`MaterialFactory.xxxMaterial()`から生成する。ジオメトリ・メッシュと異なりマテリアルだけがFactory化されている非対称な設計。
- **`scene/mesh`**: `BaseMesh`が`material: MaterialOperation`を保持し、`draw()`直前に`updateUniforms()`→`setUniform()`を呼ぶ。
- **`scene/renderer/postEffect` (`~ShaderPass`)**: ポストエフェクト用マテリアル8種は対応する`~ShaderPass`（`BrightShaderPass`, `MosaicShaderPass`等）が内部で保持し、`BaseShaderPass`コンストラクタが`Plane`ジオメトリ+`UnlitMesh`+`MeshNode`を組み立てる際に使われる。詳細は`docs/scene/renderer.md`参照。
- **`scene/renderer/RendererContext`**: `PhongMaterial`が`getCamera()`/`getLights()`を参照する唯一の接続点。

## 既知の制約・未完成部分

- `GouraudMaterial`のライト取得方法が`PhongMaterial`（`context.getLights()`から自己取得）と揃っていない（上記参照、意図的な保留）。
- `examples/sample.ts`では`update()`内でシーングラフを走査して`LightNode`インスタンスを集め`rendererContext.setLights(lights)`を呼ぶ配線が実装済み。ライト経由の描画は機能する状態にある（詳細は`docs/scene/light.md`参照）。
