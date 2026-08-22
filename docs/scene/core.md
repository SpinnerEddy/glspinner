# scene/core — シーングラフとノード階層

## 概要

`src/scene/core/`は、シーン全体のツリー構造（`SceneGraph`+`SceneNode`階層）と、フレームループを回す`Scene`/`RecordScene`を提供する。`~Node`ファミリーは`XxxOperation`インターフェースを持たない、`operation-base.md`の標準形から最も外れたファミリーの一つで、`SceneNode`という抽象クラスが直接ルートになっている。

## 主要クラス一覧

| クラス/ファイル | 役割 | 備考 |
|---|---|---|
| `node/SceneNode.ts` | 抽象基底（インターフェースなし） | 親子操作・ID生成・`shouldDraw()`を共通実装 |
| `node/EmptyNode.ts` / `GroupNode.ts` | 子への中継のみ | 実装は同一（空コンテナ/グループの意味的な違いのみ） |
| `node/MeshNode.ts` | `BaseMesh`を保持する描画ノード | `renderTag = OPAQUE` |
| `node/TextMeshNode.ts` | `TextMesh`を保持する描画ノード | `renderTag = OVERLAY` |
| `node/LightNode.ts` | ライトノードの抽象基底 | `SceneNode`の子だが自身も抽象——三段構成の中間層 |
| `node/DirectionalLightNode.ts` / `PointLightNode.ts` / `AmbientLightNode.ts` | ライト種別ごとの具象ノード | `getLightData()`で`LightParams`を返す |
| `SceneGraph.ts` | シーングラフの薄いラッパー | ルートに単一の`EmptyNode`を持つ |
| `SceneGraphUtility.ts` | 木構造操作の静的ユーティリティ | `traverse`/`findNodeById`/`addChild`/`replaceNode` |
| `SceneGraphNodeIdGenerator.ts` | ノードID自動生成 | クラス名からタグを作り連番付与 |
| `SceneOperation.ts` | シーンループの契約インターフェース | `Scene`/`RecordScene`が直接実装（共通の抽象クラスなし） |
| `Scene.ts` | `requestAnimationFrame`ループ | 通常のリアルタイム実行 |
| `RecordScene.ts` | `for`+`setTimeout`による非リアルタイム実行 | アニメーション書き出し用途 |

## アーキテクチャ・設計パターン

### `~Node`ファミリー: インターフェースなしの直接抽象化

```ts
export abstract class SceneNode {
    protected id: string;
    protected parent: SceneNode | undefined = undefined;
    protected children: SceneNode[];
    protected transform: Transform;
    protected renderTag: RenderTag;

    constructor(id: string = '') {
        this.transform = new Transform();
        this.children = [];
        this.renderTag = RenderTagConstants.ALL;
        const className = this.constructor as Function;
        this.id = id !== '' ? id : SceneGraphNodeIdGenerator.generateId(className.name);
    }

    addChild(child: SceneNode): void { if (child === this) return; child.setParent(this); }
    removeChild(child: SceneNode): void { if (child.parent !== this) return; child.setParent(undefined); }
    getChildren(): SceneNode[] { return this.children; }
    getId(): string { return this.id; }
    getTransform(): Transform { return this.transform; }
    shouldDraw(rendererContext: RendererContext): boolean {
        const renderTag = rendererContext.getActivateRenderTag();
        if (renderTag == RenderTagConstants.ALL) return true;
        return this.renderTag == renderTag;
    }
    private setParent(parent): void { /* 旧親からの取り外し + 新親への追加 */ }

    abstract update(): void;
    abstract draw(gl: WebGL2RenderingContext, context: RendererContext): void;
}
```

親子操作（`addChild`/`removeChild`/`setParent`）・ID生成・`shouldDraw()`（`RenderTag`とアクティブタグの突き合わせ、`docs/scene/renderer.md`参照）はここに共通実装がある。具象クラスが書くのは`update()`（`this.transform.updateMatrix(親のワールド行列)`が定型）と`draw()`のみ。

同一ファイル内で`==`/`!=`（`shouldDraw()`内）と`===`/`!==`（`addChild`/`setParent`内）が混在しており、プロジェクト全体を通じた等価比較演算子の不統一の一例になっている。

`LightNode`だけが「`SceneNode`→`LightNode`(抽象)→具象3クラス」という三段構成になっている珍しいケースで、他の`~Node`は`SceneNode`を直接継承する二段構成。

### ノードのID生成

```ts
export class SceneGraphNodeIdGenerator {
    private static counters: Map<string, number> = new Map();
    static generateId(className: string): string {
        const tag = className.substring(0, className.length - 4); // 末尾4文字("Node")を除去
        const count = this.counters.get(tag) ?? 0;
        this.counters.set(tag, count + 1);
        return `${tag}_${count}`;
    }
}
```

クラス名から末尾の`"Node"`を除いたタグ+連番（例: `MeshNode` → `Mesh_0`）でIDを自動生成する。

## 主要クラス詳細

### `EmptyNode` / `GroupNode`

実装は完全に同一（`update()`で自身のワールド行列を再計算してから子を更新、`draw()`で子への中継のみ）。意味的な用途の違い（空コンテナ vs グループ化）のためにクラス名だけ分けている。

### `MeshNode` / `TextMeshNode`

```ts
public draw(gl, context) {
    this.mesh.useMaterial(gl, context);
    this.mesh.updateUniforms(gl, context, this.transform);
    this.mesh.draw(gl);
}
```

`~Node`自身は描画の実体を持たず、保持している`~Mesh`（`docs/scene/mesh.md`参照）に処理を委譲する薄いラッパー。`MeshNode`は`renderTag = RenderTagConstants.OPAQUE`、`TextMeshNode`は`renderTag = RenderTagConstants.OVERLAY`をコンストラクタで設定する。

### `LightNode`とその具象3クラス

```ts
export abstract class LightNode extends SceneNode {
    protected light: Light;
    constructor(light: Light) { super(); this.light = light; }
    abstract getLightData(): LightParams;
    update(): void { /* 自身のワールド行列更新 + 子の更新 */ }
    draw(gl, context): void { /* 子への中継のみ、自身は何も描画しない */ }
}
```

- **`DirectionalLightNode`**: コンストラクタで`lightDirection: Vector3`（既定値`(-0.5, 0.5, 0.5)`）を受け取り、`setLightDirection()`で変更可能。`getLightData()`は`{direction, lightType: Directional, color, intensity}`を返す。
- **`PointLightNode`**: 追加フィールドを持たず、`getLightData()`が`this.transform.getWorldPosition()`（シーングラフ上の位置をそのままライト位置として使う）を`position`として返す。`examples/sample.ts`では`pointLightNode.getTransform().setPosition(...)`でワールド位置を設定する。
- **`AmbientLightNode`**: 方向も位置も持たず、`{lightType: Ambient, color, intensity}`のみを返す。

いずれも`SceneNode`の描画ツリー上に配置されるノードで、`update()`でTransformを更新し`draw()`では何も描画しない（子への中継のみ）——ライトは「シーングラフ上の位置を持つが、それ自体は視覚的に描画されないノード」という位置づけ。

### `SceneGraph`/`SceneGraphUtility`

```ts
export class SceneGraph {
    private readonly root: EmptyNode;
    constructor() { this.root = new EmptyNode(); }
    update(): void { this.root.update(); }
    draw(gl, context): void { this.root.draw(gl, context); }
    getGraph(): SceneNode { return this.root; }
}
```

ルートとして単一の`EmptyNode`を持つだけの薄いラッパー。横断的な木操作（`traverse`/`findNodeById`/`addChild`/`replaceNode`）は`SceneNode`自身に生やさず`SceneGraphUtility`（静的メソッド集）に集約されている。

### `Scene` / `RecordScene`（`SceneOperation`の兄弟実装）

```ts
export interface SceneOperation {
    start(): void; stop(): void; reset(): void;
    getClock(): ClockOperation;
    setUpdate(fn: Function): void; setDraw(fn: Function): void; setAdditionalSupport(fn: Function): void;
    setRealTimeClock(fps: number): void; setFixedTimeClock(fps: number, frameInterval: number): void;
}
```

`Scene`と`RecordScene`は共通の抽象クラスを介さず、それぞれ直接`SceneOperation`を`implements`する兄弟クラス。両クラスとも`private clock: ClockOperation`を1つ保持し、コンストラクタでは`RealTimeClock`をデフォルト生成する（`docs/scene/clock.md`参照）。

`Scene.run()`は`requestAnimationFrame`で毎フレーム`updateFunction()`→`drawFunction()`→`additionalSupportFunctionAsync()`を呼ぶ。`clock.shouldDraw()`による間引き描画の分岐はコメントアウトされたまま残っており、現状は毎フレーム無条件にupdate/drawが実行される。

`RecordScene.record(fps, frameNum)`は`requestAnimationFrame`を使わず、`for (let i = 450; i < frameNum; i++)`というループ内で`clock.setFrameNum(i)`→update→draw→`additionalSupport()`→`delay(700)`（`setTimeout`ベースの待機）を順次実行する非リアルタイム実行。ループの開始値が`450`固定になっている点は`tools/tools.md`で触れた`Recorder`のデフォルト`currentFrameCount = 450`と符合しており、何らかのウォームアップフレームをスキップする意図があると見られる（意図の詳細は未確認）。`RecordScene`にも`private run()`という`Scene`と同型のメソッドがコメントアウトされたまま残っている。

## 他モジュールとの関係

- **`scene/transform-camera.md` (`Transform`)**: 全`SceneNode`が1つずつ保持し、`update()`内で`updateMatrix(親のワールド行列)`を呼ぶ。
- **`scene/renderer.md` (`RenderTag`/`RendererContext`)**: `shouldDraw()`が描画対象フィルタとして参照する。`StandardSceneRendererFlow`が`SceneGraphUtility.traverse`でノードを走査する。
- **`scene/mesh.md`**: `MeshNode`/`TextMeshNode`が`BaseMesh`/`TextMesh`を保持する。
- **`scene/light.md`**: `~LightNode`系がライトのデータそのもの（`Light`）をラップしてシーングラフ上に配置する。
- **`app/app.md`**: `BaseApplication`がコンストラクタで`SceneGraph`を1つ生成する。`Scene`/`RecordScene`は利用者側`setup()`が`new`して`Application`のコンストラクタへ注入する。

## 既知の制約・未完成部分

`Scene.run()`/`RecordScene`双方に、`clock.shouldDraw()`による間引き描画ロジックがコメントアウトされたまま残っており、現状は無条件に毎フレーム処理している。
