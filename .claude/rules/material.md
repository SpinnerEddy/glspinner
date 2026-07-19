# `~Material` ファミリー規約

`src/scene/material/`配下。`XxxOperation`+`BaseXxx`の標準形に忠実なファミリー。

## 構成

- `MaterialOperation`（インターフェース、`src/scene/material/MaterialOperation.ts`）
- `BaseMaterial`（抽象基底、`src/scene/material/BaseMaterial.ts`）
- 具象クラス14個（すべて`BaseMaterial`を直接継承）: `UnlitMaterial`, `TexturedMaterial`, `PhongMaterial`, `GouraudMaterial`, `FragmentCanvasMaterial`, `FrameBufferTexturedMaterial`, `TexturedTextMaterial`（通常マテリアル）、`GrayScaleMaterial`, `MosaicMaterial`, `RGBShiftMaterial`, `GlitchMaterial`, `BlurMaterial`, `BrightMaterial`, `ComposeMaterial`, `MaskMaterial`（ポストエフェクト用マテリアル、`pass.md`の各`~ShaderPass`が内部で使う）

## `BaseMaterial`が提供する共通実装

```ts
export abstract class BaseMaterial implements MaterialOperation {
    protected shaderProgram: ShaderProgram;
    use(gl, context) {  // 同一プログラムなら再バインドしない
        if (context.isCurrentShaderProgramSame(this.shaderProgram)) return;
        this.shaderProgram.use(gl);
        context.setCurrentShaderProgram(this.shaderProgram);
    }
    getAttribute(gl, name) { return this.shaderProgram.getAttribute(gl, name); }
    cleanup(): void {}
    abstract setUniform(gl, context): void;
}
```

`use()`（シェーダプログラムの重複バインド防止）と`getAttribute()`はここで共通化されている。`cleanup()`はデフォルトで何もしない実装（テクスチャを使わないマテリアルはオーバーライド不要）。`setUniform()`だけが具象クラスの責務として`abstract`になっている。

## 具象クラスの実装パターン

ほとんどの具象クラスの`setUniform()`は以下の定型（`UnlitMaterial`が最小例）:

```ts
setUniform(gl: WebGL2RenderingContext, context: RendererContext): void {
    const uniforms = context.getGlobalUniform();
    for (const key in uniforms) {
        this.shaderProgram.setUniform(gl, key, uniforms[key]);
    }
}
```

`context.getGlobalUniform()`が返すUniform名→値の辞書をそのままシェーダへ流し込むだけ、という共通パターン。新規マテリアルを追加するときもまずこの定型から書き始めてよい。

固有の追加ロジックが必要な場合はメソッドを追加する（`Operation`インターフェースには存在しない、そのクラス固有のpublicメソッド）。例: `PhongMaterial`は`setLightUniform(gl, light: LightParams)`という固有メソッドを持ち、`LightType.Directional`/`LightType.Point`を`==`で判定してシェーダ用Uniform名を出し分ける。呼び出し側（`SimpleMesh.updateMaterialParams()`）は`this.material as PhongMaterial`のようにダウンキャストしてこの固有メソッドを呼ぶ（`MaterialOperation`の契約には現れない、ファミリー内の非対称な拡張点）。

`TexturedMaterial`系（`TexturedMaterial`, `FrameBufferTexturedMaterial`, `TexturedTextMaterial`）はテクスチャのバインドを`setUniform()`内で行い、`cleanup()`をオーバーライドしてアンバインドする（`use()`→`setUniform()`→描画→`cleanup()`という`BaseMesh.draw()`側の呼び出し順に対応）。

## Factoryとの関係

このファミリーは`MaterialFactory`（`scene/factory/MaterialFactory.ts`）から`MaterialFactory.xxxMaterial()`の形でシェーダキー名を指定して生成する。ジオメトリ・メッシュはFactory化されていない非対称な設計になっている点に注意（`operation-base.md`「Factory/Loaderパターンとの関係」参照）。新規マテリアルを追加したら`MaterialFactory`にも生成メソッドを追加するのが既存の一貫した運用。

`MaterialFactory`は`shaderLoader`/`textureLoader`/`textFontLoader`を静的に保持するファクトリで、`init()`（`application.md`の`BaseApplication.preload()`から呼ばれる）以降、`MaterialFactory.xxxMaterial()`の形で各種マテリアルをシェーダキー名から生成できるようになる。シェーダプログラム自体は`ShaderLoader.loadCommonShaders()`が`import.meta.glob`で`src/webgl/shader/*.vert`/`*.frag`（vite.config.tsの`@webgl`エイリアス経由）を一括ロード＆キャッシュしており、ファイル名（拡張子抜き）がキーになる。新規シェーダファイルを追加するだけで`ShaderLoader`側の変更なしにキーが増える設計。

なお`LightFactory`（`scene/factory/LightFactory.ts`）は現状空ファイルで未実装——マテリアルのみファクトリ化されており、ライトはファクトリ経由で組み立てられない（`operation-base.md`「Light系」参照）。

## このファミリー固有の揺れ・注意点

- `PhongMaterial.setLightUniform()`内の`light.lightType == LightType.Directional`は`==`比較（`general.md`の等価比較演算子の揺れに関連するが、このファミリー内では`==`/`!=`に統一されている）。
