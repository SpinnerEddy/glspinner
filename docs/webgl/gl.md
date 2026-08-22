# webgl/gl — WebGL2の薄いラッパー層

## 概要

`src/webgl/gl/`は、WebGL2 APIを直接扱う最下層のラッパー群。シェーダプログラムのコンパイル・リンク（`ShaderProgram`）、頂点/インデックス/UBOバッファ（`~Buffer`ファミリー）、ジオメトリの具体形状（`~Geometry`ファミリー）、属性・Uniformへのアクセス（`ShaderAttribute`/`ShaderUniform`/`ShaderUniformValue`）、テクスチャ・フォントのロードとキャッシュを担う。FBO・RenderTarget系（`fbo/`配下）は`scene/renderer`と一体で扱った方が理解しやすいため`docs/scene/renderer.md`側で詳述しており、ここでは概要のみに留める。

## 主要クラス一覧

| クラス/ファイル | 役割 | 備考 |
|---|---|---|
| `ShaderProgram.ts` | シェーダのコンパイル・リンク・Uniform/Attribute管理 | ファミリーを持たない一回限りのクラス |
| `ShaderLoader.ts` | シェーダプログラムのキャッシュ+`GlobalUniforms`一括ロード | `import.meta.glob`でファイル名をキー化 |
| `attribute/ShaderAttribute.ts` | 頂点属性の位置管理 | `getAttribLocation`のラップ |
| `attribute/ShaderAttributeConstants.ts` | 属性ごとの要素数 | `AttributeElementSize`（aPosition:3等） |
| `uniform/ShaderUniform.ts` | Uniformの位置管理と型別GL呼び出し | `setUniform(value, type)`でswitch分岐 |
| `uniform/ShaderUniformValue.ts` | 任意の値をUniform用データへ変換するアダプタ | `Vector`/`Matrix`/`number`/配列/型付き配列を吸収 |
| `uniform/ShaderUniformConstants.ts` | Uniform関連の型・定数 | `UniformBindingPoint`, `GlobalUniformKey`等 |
| `buffer/BufferOperation.ts` + `BaseBuffer.ts` | バッファの契約+抽象基底 | `bind`/`unbind`/`setData`/`dispose`の4メソッド |
| `buffer/GeometryBuffer.ts` | 頂点属性のインターリーブバッファ | position/color/normal/uvを1配列に詰める |
| `buffer/IndexBuffer.ts` | インデックスバッファ | `ELEMENT_ARRAY_BUFFER` |
| `buffer/ShaderUniformBuffer.ts` | UBO専用バッファ | 複数Uniformを1バッファへオフセット計算して詰める |
| `buffer/VertexArray.ts` | VAO（`BufferOperation`ファミリー外の独立クラス） | 複数`BaseBuffer`をまとめて管理 |
| `geometry/GeometryOperation.ts` + `BaseGeometry.ts` | ジオメトリの契約+抽象基底 | `setUpBuffers`のみ`abstract` |
| `geometry/Plane.ts` / `Rectangle.ts` / `Box.ts` / `Sphere.ts` / `Torus.ts` / `TextQuad.ts` | 具体形状 | `Box`は6面キューブとして実装済み |
| `texture/Texture2D.ts` / `TextureLoader.ts` / `TextureOperation.ts` / `TextureConstants.ts` | 2Dテクスチャとキャッシュ | `TextureSlot`定数でスロット番号を管理 |
| `font/TextFontLoader.ts` / `FontGlyph.ts` | SDFフォントのグリフ情報とテクスチャ | JSON形式のグリフデータを読み込む |
| `WebGLUtility.ts` | WebGL2コンテキスト初期化とビューポート管理 | `canvas.getContext('webgl2')`のラップ |

## アーキテクチャ・設計パターン

### `ShaderProgram`と`GlobalUniforms`ブロックの自動バインド

```ts
private createProgram(gl, vertexShaderSource, fragmentShaderSource, varyings = []): WebGLProgram {
    const program = gl.createProgram();
    this.vertexShader = this.compileShader(gl, vertexShaderSource, 'vert');
    this.fragmentShader = this.compileShader(gl, fragmentShaderSource, 'frag');
    gl.attachShader(program, this.vertexShader);
    gl.attachShader(program, this.fragmentShader);
    if (varyings.length > 0) {
        gl.transformFeedbackVaryings(program, varyings, gl.SEPARATE_ATTRIBS);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { alert(...); throw new Error('Cannot create program!!'); }

    const blockIndex = gl.getUniformBlockIndex(program, 'GlobalUniforms');
    if (blockIndex !== gl.INVALID_INDEX) {
        gl.uniformBlockBinding(program, blockIndex, UniformBindingPoint.GLOBAL);
    }

    gl.useProgram(program);
    return program;
}
```

リンク直後に`'GlobalUniforms'`という名前のUniform Blockをマジックストリングで検索し、存在すれば（`INVALID_INDEX`でなければ）`UniformBindingPoint.GLOBAL`（binding=0）へ自動バインドする。各`.vert`/`.frag`シェーダ側は`layout(std140) uniform GlobalUniforms { ... }`という宣言だけを書けばよく、`RendererContext.bindGlobalUniforms()`（`docs/scene/renderer.md`参照）とこの自動バインドが両輪でグローバルUniform配線を成立させている。

`varyings`引数はTransform Feedback用（`gl.transformFeedbackVaryings`）で、`ShaderAudioInput`（`docs/scene/audio.md`参照）のプロシージャル音声生成が利用する。

### `ShaderLoader`: ファイル名ベースの自動キャッシュ

```ts
public async loadCommonShaders(): Promise<void> {
    const vertShaderFiles = import.meta.glob('@webgl/shader/*.vert', { query: '?raw', eager: true });
    const fragShaderFiles = import.meta.glob('@webgl/shader/*.frag', { query: '?raw', eager: true });
    // ファイル名（拡張子抜き）をキーにvert/fragを対応付け、両方揃っているキーだけShaderProgramを生成
}
```

`import.meta.glob`（Viteの機能、`vite.config.ts`の`@webgl`エイリアス経由）で`src/webgl/shader/*.vert`/`*.frag`を一括ロードし、ファイル名（拡張子抜き）をキーとして`ShaderProgram`を構築する。新規シェーダファイルを追加するだけで`ShaderLoader`側のコード変更なしにキーが増える設計。`loadShaderFromPath()`（fetch経由）/`loadShaderFromSource()`（ソース文字列を直接渡す、`examples/sample.ts`がカスタムシェーダに使う）という個別ロード手段も持つ。

### `~Buffer`ファミリー: `BaseBuffer`は薄い共通化

```ts
export abstract class BaseBuffer implements BufferOperation {
    protected gl: WebGL2RenderingContext;
    protected buffer: WebGLBuffer | null = null;
    constructor(gl) { this.gl = gl; this.buffer = this.gl.createBuffer(); }
    get BufferType(): number { return this.gl.ARRAY_BUFFER; } // デフォルト、IndexBuffer等がオーバーライド
    abstract bind(): void; abstract unbind(): void; abstract setData(): void; abstract dispose(): void;
}
```

`gl`の保持とバッファオブジェクト生成のみを共通化し、4メソッドは全て`abstract`。`GeometryBuffer`（`ARRAY_BUFFER`、position/color/normal/uvのインターリーブ配列を構築）、`IndexBuffer`（`ELEMENT_ARRAY_BUFFER`）、`ShaderUniformBuffer`（`UNIFORM_BUFFER`）の3具象クラスがある。

同ディレクトリの`VertexArray`は`BufferOperation`を実装しない独立クラス——VAO自体はGPUバッファではなく「バッファ+属性設定の組をまとめる入れ物」という別レイヤーの概念のため、意図的にファミリー外に置かれている。`Map<string, BaseBuffer>`で複数バッファを名前付きで保持し、`bind()`/`unbind()`が保持する全バッファへ伝播する。

### `ShaderUniformBuffer`: UBO用の可変長オフセット計算

```ts
private initialize(uniforms: UniformPairs): void {
    let currentOffset = 0;
    Object.entries(uniforms).forEach(([key, value]) => {
        const byteSize = value.getByteSize();
        currentOffset = MathUtility.ceil(currentOffset / byteSize) * byteSize; // std140アライメント
        this.memberOffsets.set(key, currentOffset);
        currentOffset += byteSize;
    });
    const totalSize = MathUtility.ceil(currentOffset / 16) * 16; // 16バイト境界に切り上げ
    this.cpuBuffer = new Float32Array(totalSize / 4);
}
```

各Uniformの`getByteSize()`（`ShaderUniformValue`側で型から算出）を使ってstd140アライメントに沿ったオフセットを計算し、CPU側`Float32Array`を確保する。`updateUniformValue(key, value)`はCPUバッファへの書き込みのみ（変化がなければ`shouldTransfer`を立てずスキップする最適化あり）、`transferUniform()`が`bufferSubData`で実際にGPUへ転送する——「値の更新」と「GPU転送」を分離し、1フレームに複数回更新されても転送は最後の`bindGlobalUniforms()`呼び出し時に1回で済む設計。`RendererContext`が`viewMatrix`/`projectionMatrix`/`time`/`resolution`/`mouse`の5つをこれで`GlobalUniforms`ブロックとして毎フレーム転送する。

### `ShaderUniformValue`: GL呼び出し直前の変換アダプタ

```ts
export class ShaderUniformValue {
    constructor(value: UniformAvailableType, type: UniformValueType = 'float') {
        this.values = this.getValue(value);   // Vector/Matrix/number/配列/型付き配列 → 素のnumber|Float32Array|Int32Array
        this.type = this.getType(value, type); // 値の形状 + float/intから '1f'|'3fv'|'Matrix4fv' 等を決定
        this.byteSize = this.calculateByteSize(value);
    }
}
```

`UniformAvailableType = number | number[] | Float32Array | Int32Array | Matrix22 | Matrix33 | Matrix44 | Vector2 | Vector3 | Vector4`という広い入力を受け付け、`instanceof Matrix`/`instanceof Vector`（`docs/math/math.md`の自己参照ジェネリクス基底クラス）で判定して適切なGL Uniform型文字列（`UniformType`）に変換する。各`~Material`（`docs/scene/material.md`参照）は`new ShaderUniformValue(値)`でラップしてから`shaderProgram.setUniform()`に渡すのが定型。

### `ShaderUniform`: 型ごとのGL呼び出し分岐

```ts
public setUniform(value, type: UniformType): void {
    switch (type) {
        case '1f': this.gl.uniform1f(this.location, value); break;
        case '3fv': this.gl.uniform3fv(this.location, value); break;
        case 'Matrix4fv': this.gl.uniformMatrix4fv(this.location, false, value); break;
        // ...16種類のUniform型を網羅
    }
}
```

`UniformType`は`1f`/`1fv`/`1i`/`1iv`〜`4f`/`4fv`/`4i`/`4iv`（float/int×スカラー/ベクトル×1〜4要素）と`Matrix2fv`/`Matrix3fv`/`Matrix4fv`の16種類。

### `~Geometry`ファミリー: 二段階構成

`BaseGeometry`が`vao: VertexArray`と`vertices`/`color`/`normal`/`indices`（型付き配列、空配列で初期化）を共通化し、`setUpBuffers()`のみを`abstract`にする。具象クラス（`Plane`/`Box`/`Sphere`/`Torus`/`TextQuad`/`Rectangle`）はコンストラクタで生データを計算して`this.vertices`等へ代入し、`setUpBuffers(gl, attributes)`で`GeometryBuffer`+`IndexBuffer`を組み立てて`vao`に登録する、という二段階パターンに統一されている。`attributes['aColor']?.setAttributeBuffer(...)`のようにオプショナルチェイニングで属性の有無を吸収する。

`Box`（立方体）は6面それぞれに専用の頂点4つ・法線・UV・インデックス6つを個別に積み上げる形で実装されている（面ごとにハードコードされた頂点順序、`indexOffset`を4ずつ進めながら6回繰り返す）。以前は未実装だったが、現在は`examples/sample.ts`でも実際に使われている。

### テクスチャ・フォント

`TextureLoader`/`TextFontLoader`は`ShaderLoader`と同型の「`Map`キャッシュ + キー文字列で取得」パターン。`TextFontLoader`はSDF（Signed Distance Field）フォント用で、グリフ情報（`FontGlyph`、文字ごとのオフセット・UV・advance幅）をJSON形式のフォントアトラスデータから読み込む。`TextQuad`（ジオメトリ）が`Array<FontGlyph>`からテキスト全体の頂点列を組み立てる。

## 他モジュールとの関係

- **`scene/renderer.md` (`RendererContext`/`RenderTargetOperation`)**: `ShaderUniformBuffer`をUBOとして使用。FBO実装（`RenderTarget`/`CustomRenderTarget`等）は`fbo/`配下にあるがレンダリングパイプラインと一体で説明している。
- **`scene/material.md`**: 各`~Material`が`ShaderProgram.setUniform()`+`ShaderUniformValue`を通じてGPUへ値を送る。
- **`scene/factory.md` (`MaterialFactory`)**: `shaderLoader`/`textureLoader`/`textFontLoader`を静的に保持し、生成メソッド内で参照する。
- **`app/app.md` (`BaseApplication`)**: コンストラクタで`WebGLUtility`/`ShaderLoader`/`TextureLoader`/`TextFontLoader`を生成する。

## 既知の制約・未完成部分

特記事項なし（`Box`実装済み、`GlobalUniforms`自動配線も安定稼働している）。
