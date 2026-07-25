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
    abstract setUniform(gl, context, transform: Transform): void;
}
```

`use()`（シェーダプログラムの重複バインド防止）と`getAttribute()`はここで共通化されている。`cleanup()`はデフォルトで何もしない実装（テクスチャを使わないマテリアルはオーバーライド不要）。`setUniform()`だけが具象クラスの責務として`abstract`になっている。

`setUniform()`の第3引数`transform`は2026-07のリファクタ（後述）で追加された。それ以前は`RendererContext`が`globalUniforms`という可変の共有辞書を持ち、`modelMatrix`等をそこ経由で受け渡していたが、複数ノードを跨いだ書き込み順序に依存する形になっており、値が1描画分遅延して送られる実バグの温床になっていた。`transform`を関数引数として明示的に渡す形にすることで、この暗黙のグローバル状態への依存を排除している。`RendererContext`はもはや`globalUniforms`/`fragmentCanvasUniforms`のような辞書を持たず、`camera`/`lights`/`currentShaderProgram`/`renderTargetRegistry`/`activateRenderTag`/UBO関連のみを保持する（`pipeline.md`参照）。

## 具象クラスの実装パターン

パラメータを持たないマテリアルの`setUniform()`は以下の定型（`GrayScaleMaterial`/`UnlitMaterial`が典型例）:

```ts
setUniform(gl: WebGL2RenderingContext, _context: RendererContext, transform: Transform): void {
    this.shaderProgram.setUniform(gl, 'modelMatrix', new ShaderUniformValue(transform.getWorldMatrix()));
}
```

`modelMatrix`を`transform.getWorldMatrix()`から直接計算して送信するだけ、という共通パターン。`context`を使わないマテリアルは`_context`という命名にする（`general.md`のESLint設定で`argsIgnorePattern: '^_'`が「インターフェース契約上必須だが実装内で未使用な引数」として明示的に許可されているパターン）。新規マテリアルを追加するときもまずこの定型から書き始めてよい。

固有の調整パラメータを持つマテリアル（`PhongMaterial`/`GouraudMaterial`、および下記「ポストエフェクト系マテリアルの調整パラメータ」参照）は、`Operation`インターフェースには存在しないそのクラス固有のpublicメソッド（`setXxx()`）を追加する。これは`MaterialOperation`の契約には現れない、ファミリー内の非対称な拡張点という位置づけ自体は変わっていないが、2026-07のリファクタ以前は`SimpleMesh.updateMaterialParams()`が`this.material as PhongMaterial`とダウンキャストして`PhongMaterial`固有のメソッドを外部から呼んでいたのに対し、現在は**マテリアル自身が`context.getCamera()`/`context.getLights()`から必要な値を自己完結して取得し、`setUniform()`内部だけで完結する**形に変わっている（`SimpleMesh`はもはや`PhongMaterial`の存在を知らない。詳細は下記「`PhongMaterial`/`GouraudMaterial`の自己完結化」参照）。

`TexturedMaterial`系（`TexturedMaterial`, `FrameBufferTexturedMaterial`, `TexturedTextMaterial`）はテクスチャのバインドを`setUniform()`内で行い、`cleanup()`をオーバーライドしてアンバインドする（`use()`→`setUniform()`→描画→`cleanup()`という`BaseMesh.draw()`側の呼び出し順に対応）。

## `PhongMaterial`/`GouraudMaterial`の自己完結化

```ts
// PhongMaterial.ts
setUniform(gl: WebGL2RenderingContext, context: RendererContext, transform: Transform): void {
    const modelMatrix = transform.getWorldMatrix();
    const invertMatrix = modelMatrix.inverse();
    const eyeDirection = context.getCamera().calculateEyeDirection();

    this.shaderProgram.setUniform(gl, 'modelMatrix', new ShaderUniformValue(modelMatrix));
    this.shaderProgram.setUniform(gl, 'invMatrix', new ShaderUniformValue(invertMatrix));
    this.shaderProgram.setUniform(gl, 'eyeDirection', new ShaderUniformValue(eyeDirection));

    if (context.getLights().length == 0) return;

    const light = context.getLights().at(0)!;
    this.setLightUniform(gl, light);
}

private setLightUniform(gl: WebGL2RenderingContext, light: LightParams): void {
    if (light.lightType == LightType.Directional) { /* ... */ }
    else if (light.lightType == LightType.Point) { /* ... */ }
}
```

`PhongMaterial`は`modelMatrix`/`invMatrix`/`eyeDirection`を`transform`と`context.getCamera()`から自分で計算し、ライトも`context.getLights()`から自分で取り出す。`setLightUniform()`は外部から呼ばれなくなったため`private`化されている（以前は`SimpleMesh`からダウンキャストして呼ばれる`public`メソッドだった）。`GouraudMaterial`も同様に`transform`から`modelMatrix`/`invMatrix`を自己計算するが、ライトは`context.getLights()`ではなく従来通りコンストラクタ引数+setter（`lightDirection`/`eyeDirection`/`ambientColor`、下記参照）で保持する——`PhongMaterial`と完全に同じ自己完結方針を採るかどうかは意図的に据え置かれており、揺れとして記録するに留める。

このリファクタと同時に、`phongLighting.vert`/`gouraudLighting.vert`が使う`mvpMatrix`をTypeScript側から設定するコードがどこにも存在しないという重大バグ（`gl_Position`が常にゼロベクトルになり正しく描画されない）が発覚し、シェーダー側の修正で解消された。詳細は`shader.md`参照。

## ポストエフェクト系マテリアルの調整パラメータ

`GrayScaleMaterial`/`MaskMaterial`を除くポストエフェクト系マテリアル（`MosaicMaterial`, `RGBShiftMaterial`, `GlitchMaterial`, `BlurMaterial`, `BrightMaterial`, `ComposeMaterial`）は、調整パラメータをコンストラクタ引数+`setXxx()`という型付きsetterで持つ。これは元々`GouraudMaterial`が`setLightDirection()`/`setEyeDirection()`/`setAmbientColor()`で採っていたパターンをファミリー全体に広げたもの。

```ts
// MosaicMaterial.ts
export class MosaicMaterial extends BaseMaterial {
    private mosaicSize: number;

    constructor(shaderProgram: ShaderProgram, mosaicSize: number) {
        super(shaderProgram);
        this.mosaicSize = mosaicSize;
    }

    setUniform(gl: WebGL2RenderingContext, _context: RendererContext, transform: Transform): void {
        this.shaderProgram.setUniform(gl, 'modelMatrix', new ShaderUniformValue(transform.getWorldMatrix()));
        this.shaderProgram.setUniform(gl, 'mosaicSize', new ShaderUniformValue(this.mosaicSize));
        this.shaderProgram.setUniform(gl, 'tex', new ShaderUniformValue(TextureSlot.CURRENT_FRAME, 'int'));
    }

    setMosaicSize(mosaicSize: number): void {
        this.mosaicSize = mosaicSize;
    }
}
```

フィールド・setterの型は`ShaderUniformValue`ではなく素の`number`（や`[number, number]`等のドメイン型）で持つ。`ShaderUniformValue`によるラップは`setUniform()`内で`shaderProgram.setUniform()`に渡す直前の1回だけ行う——`ShaderUniformValue`はGL呼び出し直前の変換アダプタであり、Material側の状態表現として持つべきものではない。この設計判断はこのファミリーの`MaterialOperation`には現れない非対称な拡張点の一種だが、`Operation`インターフェースへ共通の`setParam(key, value)`のような形で統一しないのは意図的な判断（`general.md`「インターフェース分離の原則」的な理由——マテリアルごとにパラメータの型・個数がバラバラで、共通シグネチャに落とし込む意味がないため）。

`FragmentCanvasMaterial`だけは事情が異なる。任意のユーザー定義フラグメントシェーダー（`loadShaderFromSource`経由）と組み合わせる前提のため、パラメータ名を事前に列挙できない。そのため固定名のsetterではなく、`private customUniforms: UniformPairs = {}`（`UniformPairs = Record<string, ShaderUniformValue>`、`src/webgl/gl/uniform/ShaderUniformConstants.ts`）という任意キーを受け付けるMapライクな構造と、汎用の`setCustomUniform(key: string, value: ShaderUniformValue): void`を持つ。`setUniform()`内は`Object.entries(this.customUniforms).forEach(...)`（または`for...in`）でループしてシェーダへ送る。これはページ全体で共有される可変辞書（廃止された`RendererContext.globalUniforms`）とは異なり、**そのマテリアルインスタンス1つに閉じたMap**である点が重要——他ノード・他フレームとの値の取り違えというバグの再発を避けつつ、任意uniformを受け付ける柔軟性だけを残している。

## Factoryとの関係

このファミリーは`MaterialFactory`（`scene/factory/MaterialFactory.ts`）から`MaterialFactory.xxxMaterial()`の形でシェーダキー名を指定して生成する。ジオメトリ・メッシュはFactory化されていない非対称な設計になっている点に注意（`operation-base.md`「Factory/Loaderパターンとの関係」参照）。新規マテリアルを追加したら`MaterialFactory`にも生成メソッドを追加するのが既存の一貫した運用。ポストエフェクト系マテリアルのように調整パラメータを持つ場合、`MaterialFactory`側の生成メソッドもその初期値を引数で受け取れるようにする（例: `mosaicMaterial(mosaicSize: number): MosaicMaterial`）。

`MaterialFactory`は`shaderLoader`/`textureLoader`/`textFontLoader`を静的に保持するファクトリで、`init()`（`application.md`の`BaseApplication.preload()`から呼ばれる）以降、`MaterialFactory.xxxMaterial()`の形で各種マテリアルをシェーダキー名から生成できるようになる。シェーダプログラム自体は`ShaderLoader.loadCommonShaders()`が`import.meta.glob`で`src/webgl/shader/*.vert`/`*.frag`（vite.config.tsの`@webgl`エイリアス経由）を一括ロード＆キャッシュしており、ファイル名（拡張子抜き）がキーになる。新規シェーダファイルを追加するだけで`ShaderLoader`側の変更なしにキーが増える設計。

なお`LightFactory`（`scene/factory/LightFactory.ts`）は現状空ファイルで未実装——マテリアルのみファクトリ化されており、ライトはファクトリ経由で組み立てられない（`operation-base.md`「Light系」参照）。

## このファミリー固有の揺れ・注意点

- `PhongMaterial.setLightUniform()`内の`light.lightType == LightType.Directional`は`==`比較（`general.md`の等価比較演算子の揺れに関連するが、このファミリー内では`==`/`!=`に統一されている）。
- `GouraudMaterial`のライト値取得方法（コンストラクタ引数+setter）が`PhongMaterial`（`context.getLights()`から自己取得）と揃っていない点は、上記「自己完結化」節に記載の通り意図的な保留。

## 変更履歴

- 2026-07-25: 「Material/Mesh Uniform受け渡し方式の統一リファクタ」（Notionタスク①〜⑨）を反映。`setUniform()`への`transform`引数追加、`RendererContext.globalUniforms`辞書の廃止、`PhongMaterial`/`GouraudMaterial`の自己完結化（`SimpleMesh`からのダウンキャスト解消）、ポストエフェクト系マテリアルのコンストラクタ引数+setter化、`FragmentCanvasMaterial`の`customUniforms`（インスタンス限定Map）追加を反映して全面改訂した。
