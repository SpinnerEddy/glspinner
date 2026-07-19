# `~Buffer` ファミリー規約

`src/webgl/gl/buffer/`配下。`XxxOperation`+`BaseXxx`の形をとるが、**同じディレクトリにいる`VertexArray`が`BufferOperation`を実装しない**という、ディレクトリ単位では紛らわしい例外がある。

## 構成

- `BufferOperation`（インターフェース）
- `BaseBuffer`（抽象基底）
- 具象クラス3個: `GeometryBuffer`, `IndexBuffer`, `ShaderUniformBuffer`（いずれも`BaseBuffer`を継承）
- **同ディレクトリだが非メンバー**: `VertexArray`（`src/webgl/gl/buffer/VertexArray.ts`）は`BufferOperation`を実装しない独立クラス。VAO（`WebGLVertexArrayObject`）自体はGPUバッファではなく「バッファ+属性設定の組をまとめる入れ物」という別レイヤーの概念のため、意図的にファミリー外に置かれていると考えられる。

## `BufferOperation` / `BaseBuffer`

```ts
export interface BufferOperation {
    bind(): void;
    unbind(): void;
    setData(): void;
    dispose(): void;
}

export abstract class BaseBuffer implements BufferOperation {
    protected gl: WebGL2RenderingContext;
    protected buffer: WebGLBuffer | null = null;

    constructor(gl){ this.gl = gl; this.buffer = this.gl.createBuffer(); }

    get BufferType(): number { return this.gl.ARRAY_BUFFER; }

    abstract bind(): void;
    abstract unbind(): void;
    abstract setData(): void;
    abstract dispose(): void;
}
```

`gl`の保持とバッファオブジェクトの生成（`gl.createBuffer()`）のみを共通化し、4メソッドは全て`abstract`（`BaseDevice`/`BaseSceneRendererFlow`と同種の「共通ロジックが薄いBase」）。`get BufferType()`はgetterアクセサ（`ARRAY_BUFFER`がデフォルト）で、`IndexBuffer`のように`ELEMENT_ARRAY_BUFFER`を使うクラスはこれをオーバーライドする。

## 具象クラスの実装パターン（`GeometryBuffer`）

```ts
export class GeometryBuffer extends BaseBuffer {
    private interleavedArray: Float32Array;

    get BufferType(): number { return this.gl.ARRAY_BUFFER; }

    bind(): void { this.gl.bindBuffer(this.BufferType, this.buffer); }
    unbind(): void { this.gl.bindBuffer(this.BufferType, null); }
    setData(): void {
        this.gl.bindBuffer(this.BufferType, this.buffer);
        this.gl.bufferData(this.BufferType, this.interleavedArray, this.gl.STATIC_DRAW);
    }
    dispose(): void {
        if (this.buffer) { this.gl.deleteBuffer(this.buffer); this.buffer = null; }
    }
}
```

`bind()`/`unbind()`/`setData()`/`dispose()`はいずれも「`this.BufferType`を介して`gl.xxxBuffer`系APIを1回呼ぶだけ」という薄い実装。`GeometryBuffer`はposition/color/normal/uvをインターリーブした単一配列を`createInterleavedArray()`で構築する役割も持つ（`vertexNum != colorNum`のように不等号は`!=`を使用）。

## UBO専用の`ShaderUniformBuffer`

`ShaderUniformBuffer`は他の2クラスと違い「複数Uniformを1つのGPUバッファへ詰めて丸ごと転送する」責務を持つ特殊な`~Buffer`。各Uniformの`getByteSize()`からオフセット（`memberOffsets`）を計算してCPU側`Float32Array`を確保し、`updateUniformValue()`（CPUバッファへの書き込みのみ）と`transferUniform()`（`bufferSubData`によるGPU転送）を分離している。`RendererContext`が`viewMatrix`/`projectionMatrix`/`time`/`resolution`/`mouse`の5つをこれで`GlobalUniforms`ブロックとして毎フレーム転送する（README記載の「UBOの情報のまとめ方を再考したい」という課題の対象）。新規にUBO経由でシェーダへ値を渡す場合はこのクラスの既存フィールド構成に追記する形になる。

`ShaderProgram`（`src/webgl/gl/ShaderProgram.ts`、ファミリーを持たない一回限りのクラス）側にも対になる自動配線ロジックがある。`createProgram()`がリンク直後に`gl.getUniformBlockIndex(program, "GlobalUniforms")`で該当Uniform Blockの有無を調べ、存在すれば（`INVALID_INDEX`でなければ）`gl.uniformBlockBinding(program, blockIndex, UniformBindingPoint.GLOBAL)`で自動的にbinding=0へ結びつける（`ShaderProgram.ts:67-69`）。各`.vert`/`.frag`シェーダ側は`layout(std140) uniform GlobalUniforms { ... }`という宣言だけを書けばよく、`RendererContext.bindGlobalUniforms()`（`UniformBindingPoint.GLOBAL`へのバッファ側バインド）とこの`ShaderProgram`側の自動バインドが両輪でUBO経由のグローバルUniform配線を成立させている。新規シェーダファイルで`GlobalUniforms`ブロックを使う場合、`ShaderProgram`側の変更は不要（ブロック名を一致させるだけでよい）。

## `~Geometry`ファミリーとの関係

`GeometryBuffer`/`IndexBuffer`は`geometry.md`の各具象クラスの`setUpBuffers()`から生成・使用される（Geometryが所有するVAOにBufferを登録する構図）。
