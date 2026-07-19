# `~Node` ファミリー規約

`src/scene/core/node/`配下。**このファミリーには`XxxOperation`インターフェースが存在しない**。`SceneNode`という抽象クラスが直接ルートになっており、`operation-base.md`の標準形からもっとも外れているファミリーの一つ。新規に`~Node`クラスを追加するときも、`NodeOperation`のようなインターフェースを新設しない（既存の慣習にない）。

## 構成

- `SceneNode`（抽象基底、インターフェースなしで直接abstract）
- `EmptyNode` / `GroupNode`（実装は同一。子への update/draw の中継のみ）
- `MeshNode`（`BaseMesh`を保持。`renderTag = OPAQUE`）
- `TextMeshNode`（`TextMesh`用。`renderTag = OVERLAY`）
- `LightNode`（抽象、`SceneNode`を継承。`getLightData(): LightParams`を要求する追加の抽象メソッドを持つ）
- `PointLightNode` / `DirectionalLightNode`（`LightNode`の具象）

`LightNode`は「`~Node`ファミリーの中でさらに一段抽象化がある」珍しいケース（`SceneNode` → `LightNode`(抽象) → `PointLightNode`/`DirectionalLightNode`(具象)という三段構成）。他の`~Node`は`SceneNode`を直接継承する二段構成。

## `SceneGraph`とツリー操作ユーティリティ（周辺クラス）

`SceneGraph`（`src/scene/core/SceneGraph.ts`）は`~Node`ファミリーそのものではないが、このファミリーを保持・操作する薄いラッパーとして併せて扱う。ルートとして単一の`EmptyNode`を持つだけの構造で、実体は`SceneNode`の木構造。

- **ID生成**: `SceneGraphNodeIdGenerator`がクラス名からタグを作りカウンタで連番付与する（例: `Mesh_0`）。`SceneNode`のコンストラクタが自動的に呼び出す。
- **木操作**: `SceneGraphUtility`が`traverse`/`findNodeById`/`addChild`/`replaceNode`などのユーティリティを提供する。`SceneNode`自身は親子操作の一次API（`addChild`/`removeChild`）のみを持ち、横断的な木操作は`SceneGraphUtility`側に集約されている（ノード自身に生やさない、という役割分担）。

## `Transform`（周辺クラス）

`Transform`（`src/scene/transform/Transform.ts`）は`SceneNode`が1つずつ保持する位置・回転・スケールと、それらから導出するワールド行列を管理する。`update()`は各ノードで`this.transform.updateMatrix(this.parent?.getTransform().getWorldMatrix())`を呼び、親のワールド行列を使って自身のワールド行列を再計算する。`isRequiredRecalculation`フラグで無駄な行列計算をスキップする（`setPosition`/`setScale`/`setRotation`のいずれかが呼ばれたときのみ再計算）。`Transform`は`getXxx()`/`setXxx()`のメソッド形式のアクセサを使う（`vector-matrix.md`で触れた`Vector2`等のアクセサ形式とは異なる。`general.md`「未解決・揺れがある事項」6番参照）。

## `Camera`（周辺クラス、シーングラフには属さない）

`Camera`（`src/scene/camera/Camera.ts`）はPerspective/Orthographicの両方に対応し、`viewMatrix`/`projectionMatrix`を保持する。`~Node`ファミリーのようにツリーには属さず、`RendererContext.setCamera()`で直接セットされ、`RendererContext.updateGlobalUniformValues()`の中でグローバルUniformバッファへview/projection行列が書き込まれる（`pipeline.md`参照）。カメラは「ノード」というより「レンダリングコンテキストが直接持つ設定オブジェクト」という位置づけ。

## `SceneNode`が提供する共通実装

```ts
export abstract class SceneNode {
    protected id: string;
    protected parent: SceneNode | undefined = undefined;
    protected children: SceneNode[];
    protected transform: Transform;
    protected renderTag: RenderTag;

    public addChild(child: SceneNode): void { ... }
    public removeChild(child: SceneNode): void { ... }
    public getChildren(): SceneNode[] { ... }
    public getId(): string { ... }
    public getTransform(): Transform { ... }
    public shouldDraw(rendererContext: RendererContext): boolean { ... }
    private setParent(parent: SceneNode | undefined): void { ... }

    public abstract update(): void;
    public abstract draw(gl: WebGL2RenderingContext, context: RendererContext): void;
}
```

親子操作（`addChild`/`removeChild`/`setParent`）・ID生成（`SceneGraphNodeIdGenerator.generateId(className.name)`をコンストラクタで自動呼び出し）・`shouldDraw()`（`RenderTag`とアクティブタグの突き合わせ）はここに共通実装がある。具象クラスが書くのは`update()`（`this.transform.updateMatrix(親のワールド行列)`が定型）と`draw()`のみ。

## `SceneNode.ts`自体の等価比較演算子について

`SceneNode.ts`は同一ファイル内で`==`/`!=`（`shouldDraw()`内など）と`===`/`!==`（`addChild`/`setParent`内など）の両方を使っている。`general.md`「未解決・揺れがある事項」参照。このファイルを触るときにどちらを使うか単一の正解はなく、変更箇所に近い既存コードの書き方に合わせるのが無難（`addChild`/`setParent`周りなら`===`、`shouldDraw`周りなら`==`）。

## `Light`データクラスとの違い

`LightNode`/`PointLightNode`/`DirectionalLightNode`は「シーングラフ上の位置を持つノード」であり、色・強度などの値そのものを表す`Light`/`LightOperation`（`src/scene/light/`）とは別物。`LightNode.getLightData()`が`Light`由来のデータを`LightParams`としてまとめて返す橋渡し役になっている。`Light`系の規約は`operation-base.md`の小規模ファミリー節を参照。

## `MeshNode`の`draw()`パターン

```ts
public draw(gl, context) {
    this.mesh.useMaterial(gl, context);
    this.updateUniforms(gl, context);       // modelMatrixをグローバルUniformへ反映 + mesh.updateUniforms
    this.updateMaterialParams(gl, context); // ライティング用パラメータなど
    this.mesh.draw(gl);
}
```

`~Node`自身は描画の実体を持たず、保持している`~Mesh`（`mesh.md`参照）に処理を委譲する薄いラッパーという役割分担。新規の描画系Nodeを追加する場合もこのパターン（Nodeは委譲のみ、実体はMesh側）を踏襲する。
