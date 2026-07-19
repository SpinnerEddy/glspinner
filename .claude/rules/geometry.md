# `~Geometry`ファミリー規約（`Plane`/`Torus`等の具体形状クラス）

`src/webgl/gl/geometry/`配下。`XxxOperation`+`BaseXxx`の標準形。具象クラス名自体には`Geometry`という接尾辞は付かず（`Plane`, `Rectangle`, `Torus`, `Sphere`, `TextQuad`）、ファミリーの括りは接尾辞ではなく「`BaseGeometry`を継承している」という継承関係で決まる点が他ファミリー（`~Material`, `~Mesh`等）と異なる。

## 構成

- `GeometryOperation`（インターフェース）
- `BaseGeometry`（抽象基底）
- 具象クラス: `Plane`, `Rectangle`, `Sphere`, `Torus`, `TextQuad`

`Box`（立方体）は**現時点で`src/`に実装が存在しない**（`grep`で確認済み）。README「次やること」に「立方体など描けるジオメトリの種類を増やす」とあるとおり、未着手の既知ギャップ（`glspinner-task-discovery`の対象）。新規に追加する場合は`Torus`/`Sphere`と同じ二段階構成（コンストラクタで生データ計算 → `setUpBuffers()`でGPUバッファ構築）に合わせる。

## `BaseGeometry`が提供する共通実装

```ts
export abstract class BaseGeometry implements GeometryOperation {
    protected vao: VertexArray;
    protected vertices: Float32Array;
    protected color: Float32Array;
    protected normal: Float32Array;
    protected indices: Int16Array;

    constructor(gl) {
        this.vao = new VertexArray(gl);
        this.vertices = new Float32Array;
        this.color = new Float32Array;
        this.normal = new Float32Array;
        this.indices = new Int16Array;
    }

    abstract setUpBuffers(gl, attributes: Record<string, ShaderAttribute>): void;

    bind(): void { this.vao.bind(); }
    unbind(): void { this.vao.unbind(); }
    getIndexCount(): number { return this.indices.length; }
    dispose(): void { this.vao.dispose(); }
}
```

`VertexArray`（`buffer.md`で触れた「`BufferOperation`ファミリー外」のクラス）の保持と、頂点/色/法線/インデックス配列の型付き配列としての初期化（`new Float32Array`のように引数なしで呼ぶ書き方に注意。空配列の意）を共通化している。`bind()`/`unbind()`/`getIndexCount()`/`dispose()`は`vao`への委譲のみ。`setUpBuffers()`だけが具象クラスの責務。

## 具象クラスの実装パターン

コンストラクタで頂点・色・法線・インデックスの生データを計算して`this.vertices`等へ代入し、`setUpBuffers(gl, attributes)`で実際のGPUバッファ（`GeometryBuffer`/`IndexBuffer`、`buffer.md`参照）を組み立てて`vao`に登録する、という二段階構成。`Torus`の例:

```ts
setUpBuffers(gl, attributes): void {
    this.vao.bindVao();
    const gb = new GeometryBuffer(gl, this.vertices, this.color, this.normal);
    const ib = new IndexBuffer(gl, this.indices);
    gb.setData();
    ib.setData();
    // attributes["aPosition"].setAttributeBuffer(...) でstride/offsetを設定
    this.vao.addBuffer("geometry", gb);
    this.vao.addBuffer("index", ib);
    gb.unbind();
    ib.unbind();
    this.vao.unbindVao();
}
```

`attributes["aColor"]?.setAttributeBuffer(...)`のようにオプショナルチェイニングで属性の有無を吸収している点、`stride`計算に`AttributeElementSize`定数（`Constants`パターン、`general.md`参照）を使っている点は新規ジオメトリ追加時にも踏襲する。

## Factoryとの関係

`~Material`と異なり`~Geometry`はFactory化されていない。アプリ側（`setup()`）で`new Torus(gl, ...)`のように直接インスタンス化するのが現状の一貫したスタイル（`operation-base.md`「Factory/Loaderパターンとの関係」参照。これは既知の非対称であり無理に統一しない）。
