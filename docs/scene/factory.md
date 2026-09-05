# scene/factory — マテリアル/ライト生成のファクトリ層

## 概要

`src/scene/factory/`は「シェーダキー名や色・強度といった単純な引数から、生成の面倒を見てインスタンスを返す」ファクトリ層。`MaterialFactory`は`ShaderLoader`/`TextureLoader`/`TextFontLoader`という3つのLoaderを静的に束ね、`~Material`ファミリー15クラス全ての生成メソッドを持つ。`LightFactory`は`Light`データオブジェクトを生成する非常に小さなファクトリ。

## 主要クラス一覧

| クラス/ファイル | 役割 | 備考 |
|---|---|---|
| `MaterialFactory.ts` | 全マテリアルの生成窓口 | 静的クラス、`init()`で3つのLoaderを注入 |
| `LightFactory.ts` | `Light`データオブジェクトの生成 | `static light(color, intensity): Light`の1メソッドのみ |

## アーキテクチャ・設計パターン

`MaterialFactory`は`Operation+Base`パターンの対象外（`operation-base.md`が言う「差し替え可能なサブシステムの入口」ではなく、単純にキャッシュ済みLoaderから生成物を組み立てるだけの役割）で、全メソッド静的、状態はクラス自身が静的フィールドとして1つだけ持つ（アプリ全体でシングルトン運用）。`init(shaderLoader, textureLoader, textFontLoader)`が呼ばれるまでは各生成メソッドが`throw new Error('MaterialFac†ory not initialized. Call init!!')`で防御する（メッセージ中の"Fac†ory"という誤字はソースにそのまま存在する）。

`init()`は`BaseApplication.preload()`（`docs/app/app.md`参照）から呼ばれる唯一の箇所で、アプリ起動シーケンスの一部として自動的に配線される。

ジオメトリ・メッシュはこの層に相当するファクトリを持たない非対称な設計になっている（`~Geometry`/`~Mesh`はアプリ側`setup()`で直接`new`する）。マテリアルだけがFactory化されているのは、マテリアルの生成にシェーダ/テクスチャ/フォントという複数キャッシュの参照が絡み、単純な`new`だけでは組み立てが完結しないため。

## 主要クラス詳細

### `MaterialFactory`

```ts
export class MaterialFactory {
    private static shaderLoader: ShaderLoader;
    private static textureLoader: TextureLoader;
    private static textFontLoader: TextFontLoader;

    static init(shaderLoader, textureLoader, textFontLoader): void { ... }
    // 以下、全15マテリアルに対応する生成メソッド
}
```

生成メソッド一覧（15マテリアル分すべてに対応）:

| メソッド | 対応マテリアル | シェーダキー |
|---|---|---|
| `unlitMaterial()` | `UnlitMaterial` | `'unlit'` |
| `texturedMaterial(textureKey, texIndex)` | `TexturedMaterial` | `'texture'` |
| `phongMaterial(shininess = 50.0)` | `PhongMaterial` | `'phongLighting'` |
| `gouraudMaterial(shininess = 50.0)` | `GouraudMaterial` | `'gouraudLighting'`（`phongMaterial()`と同じシグネチャ。以前は`lightDirection?/eyeDirection?/ambientColor?`という別引数だったが、`PhongMaterial`との共通化（`LitMaterial`導入）に伴い揃えられた） |
| `fragmentCanvasMaterial(programKey)` | `FragmentCanvasMaterial` | 任意（引数で指定） |
| `frameBufferTextureMaterial()` | `FrameBufferTexturedMaterial` | `'framebuffer'` |
| `texturedTextMaterial(smoothness, fontColorHex)` | `TexturedTextMaterial` | `'text'` |
| `customTexturedTextMaterial(shaderKey, smoothness, fontColorHex)` | `TexturedTextMaterial`（シェーダキー差し替え版） | 任意 |
| `grayScaleMaterial()` | `GrayScaleMaterial` | `'grayScale'` |
| `singleDirectionBlurMaterial(isVertical, blurStrength, texResolution, blurRange)` | `BlurMaterial` | `'blur'` |
| `brightMaterial(brightThreshold)` | `BrightMaterial` | `'bright'` |
| `maskMaterial(shaderKey)` | `MaskMaterial` | 任意（汎用マスク用にキーを外から指定） |
| `composeMaterial(bloomStrength)` | `ComposeMaterial` | `'compose'` |
| `mosaicMaterial(mosaicSize)` | `MosaicMaterial` | `'mosaic'` |
| `rgbShiftMaterial(shiftOffset)` | `RGBShiftMaterial` | `'rgbShift'` |
| `glitchMaterial(glitchCoef)` | `GlitchMaterial` | `'glitch'` |

`texturedTextMaterial()`/`customTexturedTextMaterial()`は`ColorUtility.hexToColor01(fontColorHex).toRGBAArray`でHex文字列からRGBA配列へ変換してから`TexturedTextMaterial`へ渡す。

### `LightFactory`

```ts
export class LightFactory {
    static light(color: Color, intensity: number): Light {
        return new Light(color, intensity);
    }
}
```

`Light`（`LightOperation`実装、色と強度のみを持つ値オブジェクト。`docs/scene/light.md`参照）を生成するだけの1行メソッド。`examples/sample.ts`では`LightFactory.light(color, intensity)`で`Light`を作り、`DirectionalLightNode`/`AmbientLightNode`/`PointLightNode`のコンストラクタへ渡す、という使い方をしている。

## 他モジュールとの関係

- **`app/app.md` (`BaseApplication`)**: `preload()`が`MaterialFactory.init()`を呼ぶ唯一の箇所。
- **`scene/material`**: 全15マテリアルクラスの生成元。
- **`webgl/gl.md` (`ShaderLoader`/`TextureLoader`/`TextFontLoader`)**: `MaterialFactory`が内部で参照する3つのキャッシュ機構。
- **`scene/light.md` (`Light`, `~LightNode`)**: `LightFactory.light()`が生成した`Light`をライトノードのコンストラクタへ渡す。

## 既知の制約・未完成部分

`LightFactory`は現状`light()`の1メソッドのみで、`MaterialFactory`のような複数バリエーションの生成メソッド群には育っていない（ライトの種別＝Directional/Point/Ambientは`~LightNode`側の具象クラス選択で決まり、`LightFactory`自体は色・強度だけを受け取る共通の`Light`データを作るだけ）。
