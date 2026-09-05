# scene/light — ライトのデータ表現とシーングラフ上の配置

## 概要

glspinnerのライティングは2つの別レイヤーで表現される。「色・強度そのもの」を表す`Light`（`src/scene/light/`、`LightOperation`実装の値オブジェクト）と、「シーングラフ上の位置・方向」を持つ`~LightNode`（`src/scene/core/node/`、`docs/scene/core.md`で扱ったノード階層の一部）。両者は`getLightData(): LightParams`という橋渡しメソッドで接続され、最終的に`RendererContext.setLights()`経由で`LitMaterial`（`PhongMaterial`/`GouraudMaterial`の共通基底、`docs/scene/material.md`参照）へ渡る。

## 主要クラス一覧

| クラス/ファイル | 役割 | 備考 |
|---|---|---|
| `light/LightOperation.ts` | 契約インターフェース | `setColor`/`setIntensity`/`getColor`/`getIntensity`の4メソッド |
| `light/Light.ts` | ライトの値オブジェクト | `LightOperation`を**抽象クラスを介さず直接**implements（単独実装、兄弟クラスなし） |
| `light/LightConstants.ts` | ライト種別・パラメータ型 | `LightType`, `DirectionalLightParams`/`PointLightParams`/`AmbientLightParams`, `LightParams` |
| `core/node/LightNode.ts` | ライトノードの抽象基底 | `docs/scene/core.md`参照 |
| `core/node/DirectionalLightNode.ts` / `PointLightNode.ts` / `AmbientLightNode.ts` | ライト種別ごとの具象ノード | 同上 |
| `factory/LightFactory.ts` | `Light`の生成 | `docs/scene/factory.md`参照 |

## アーキテクチャ・設計パターン

### `Light`（データそのもの）: `operation-base.md`の「小規模ファミリー」パターン

```ts
export interface LightOperation {
    setColor(color: Color): void;
    setIntensity(intensity: number): void;
    getColor(): Color;
    getIntensity(): number;
}

export class Light implements LightOperation {
    private color: Color;
    private intensity: number;
    constructor(color: Color, intensity: number) { this.color = color; this.intensity = intensity; }
    setColor(color: Color): void { this.color = color; }
    setIntensity(intensity: number): void { this.intensity = intensity; }
    getColor(): Color { return this.color; }
    getIntensity(): number { return this.intensity; }
}
```

`LightOperation`→`Light`は**abstractではなく具象クラスが直接implementsする**、かつ兄弟クラスがいない単独実装——`Operation+Base`の標準形（インターフェース→抽象Base→複数具象）から外れた小規模ファミリーの一つ。色(`Color`)と強度(`number`)のみを持つ最小限の値オブジェクトで、種別（Directional/Point/Ambient）の情報は持たない。

### `LightConstants`: 種別ごとのパラメータ型

```ts
export const LightType = { Directional: 1, Point: 2, Ambient: 3 } as const;
export const MAX_DIRECTIONAL_LIGHTS = 8;
export const MAX_POINT_LIGHTS = 8;

type LightCommonParams = { color: Color; intensity: number };
export type DirectionalLightParams = LightCommonParams & { lightType: typeof LightType.Directional; direction: Vector3 };
export type PointLightParams = LightCommonParams & { lightType: typeof LightType.Point; position: Vector3 };
export type AmbientLightParams = LightCommonParams & { lightType: typeof LightType.Ambient };
export type LightParams = DirectionalLightParams | PointLightParams | AmbientLightParams;
```

`LightParams`は3種別のタグ付きUnion型（`lightType`で判別）。`LitMaterial.setLightUniforms()`（`docs/scene/material.md`参照。`PhongMaterial`/`GouraudMaterial`双方が継承）が`lightType`でフィルタしてシェーダへ送る。

### `~LightNode`: シーングラフ上の位置を持つラッパー

`Light`（データ）と`~LightNode`（シーングラフ上の配置）が分離されているのは、同じ色・強度のライトでも「Directional=方向のみ持つ」「Point=ワールド座標を持つ」「Ambient=方向も位置も持たない」という配置情報の違いをシーングラフのTransform機構（`docs/scene/transform-camera.md`参照）に委ねるため。`PointLightNode.getLightData()`は`this.transform.getWorldPosition()`でシーングラフ上のワールド座標をそのままライト位置として使う。

## 主要クラス詳細

### ライトデータの収集配線（`examples/sample.ts`での実際の使用例）

```ts
// setup(): ライトノードをシーングラフへ追加
const directionalLight = GLSpinner.LightFactory.light(new GLSpinner.Color(0.1, 0.3, 0.8), 1.0);
const directionalLightNode = new GLSpinner.DirectionalLightNode(directionalLight);
GLSpinner.SceneGraphUtility.addChild(this.baseSceneRoot, directionalLightNode);

const ambientLight = GLSpinner.LightFactory.light(new GLSpinner.Color(1.0, 1.0, 1.0), 0.1);
GLSpinner.SceneGraphUtility.addChild(this.baseSceneRoot, new GLSpinner.AmbientLightNode(ambientLight));

const pointLight = GLSpinner.LightFactory.light(new GLSpinner.Color(1.0, 0.2, 0.2), 1.0);
const pointLightNode = new GLSpinner.PointLightNode(pointLight);
pointLightNode.getTransform().setPosition(new GLSpinner.Vector3(6, 0, 6));
GLSpinner.SceneGraphUtility.addChild(this.baseSceneRoot, pointLightNode);

// update(): 毎フレーム、シーングラフを走査してLightNodeを集めRendererContextへ渡す
const lights: GLSpinner.LightParams[] = [];
GLSpinner.SceneGraphUtility.traverse(this.baseSceneRoot, (node) => {
    if (node instanceof GLSpinner.LightNode) {
        lights.push(node.getLightData());
    }
    node.update();
});
this.rendererContext.setLights(lights);
```

`RendererContext`は`private lights: LightParams[] = []`を保持し、`setLights(lights)`/`getLights()`の単純なsetter/getterペアを持つ（`docs/scene/renderer.md`参照）。この配線はライブラリ側（`src/`）には無く、**アプリ利用者側（`examples/sample.ts`）が`instanceof LightNode`でシーングラフを走査して毎フレーム収集する**という実装になっている——`~LightNode`をシーングラフに追加するだけでは自動的にレンダリングへ反映されず、この収集ループをアプリ側で書く必要がある。

## 他モジュールとの関係

- **`scene/material.md` (`LitMaterial`)**: `context.getLights()`を呼び、`LightType`ごとにフィルタしてシェーダUniformへ送る消費者（`PhongMaterial`/`GouraudMaterial`双方がこれを継承）。
- **`scene/factory.md` (`LightFactory`)**: `Light`インスタンスの生成元。
- **`scene/core.md` (`~LightNode`)**: ライトのシーングラフ上の配置を担う。
- **`scene/renderer.md` (`RendererContext`)**: `lights: LightParams[]`を保持するハブ。

## 既知の制約・未完成部分

- ライトデータの収集（シーングラフを走査して`LightNode`を集める処理）はライブラリ側に共通ロジックとして存在せず、アプリ利用者側で毎回書く必要がある。`InputHub`の`update()`のようにライブラリ側で一括処理する仕組みは無い。
- `Light`自体は色・強度のみを持つ最小限のクラスで、`~Material`のような複数具象クラスへの分岐は無い（種別の違いは`~LightNode`側の具象クラス選択で表現される）。
