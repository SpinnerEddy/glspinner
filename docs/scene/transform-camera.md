# scene/transform, scene/camera — 位置・回転・スケールとカメラ

## 概要

`Transform`（`src/scene/transform/`）はシーンノードが1つずつ保持する位置・回転・スケール情報とワールド行列の遅延計算を担う。`Camera`（`src/scene/camera/`）はシーングラフには属さず、透視投影・平行投影の両方に対応する独立した設定オブジェクトとして`RendererContext`に直接セットされる。

## 主要クラス一覧

| クラス/ファイル | 役割 | 備考 |
|---|---|---|
| `transform/Transform.ts` | 位置・回転・スケールとワールド行列 | `isRequiredRecalculation`フラグで再計算を間引く |
| `camera/Camera.ts` | 透視/平行投影カメラ | `view`/`projection`行列を保持、シーングラフ非所属 |
| `camera/CameraConstants.ts` | カメラ関連の型・定数 | `CameraOptions`/`CameraDirection`/`CameraType` |

## アーキテクチャ・設計パターン

`Transform`は`getXxx()`/`setXxx()`というメソッド形式のアクセサを使う（`Vector2`等のアクセサ形式=`get x()`とは異なる書き方、`docs/math/math.md`参照）。`setPosition`/`setScale`/`setRotation`のいずれかが呼ばれると`isRequiredRecalculation`フラグが立ち、次回`updateMatrix()`が呼ばれたときだけ実際に行列を再計算する——毎フレーム無条件に行列計算するのではなく、値が変わったときだけ計算する遅延評価。

`Camera`はシーングラフのノードではなく、`RendererContext.setCamera()`で直接セットされ、`RendererContext.updateGlobalUniformValues()`の中でグローバルUniformバッファへview/projection行列が書き込まれる（`docs/scene/renderer.md`参照）。カメラは「ノード」というより「レンダリングコンテキストが直接持つ設定オブジェクト」という位置づけ。

## 主要クラス詳細

### `Transform`

```ts
export class Transform {
    private position: Vector3;
    private scale: Vector3;
    private rotation: Quaternion;
    private localMatrix: Matrix44;
    private worldMatrix: Matrix44;
    private isRequiredRecalculation: boolean;

    constructor() {
        this.position = new Vector3(0, 0, 0);
        this.scale = new Vector3(1, 1, 1);
        this.rotation = QuaternionCalculator.identity();
        // localMatrix/worldMatrixは単位行列で初期化
        this.isRequiredRecalculation = false;
    }

    updateMatrix(parentMatrix?: Matrix44): void {
        if (!this.isRequiredRecalculation) return;
        this.calculateLocalMatrix();
        this.calculateWorldMatrix(parentMatrix);
        this.isRequiredRecalculation = false;
    }

    getWorldMatrix(): Matrix44 { return this.worldMatrix; }
    setPosition(position: Vector3): void { this.position = position; this.isRequiredRecalculation = true; }
    setScale(scale: Vector3): void { this.scale = scale; this.isRequiredRecalculation = true; }
    setRotation(rotation: Quaternion): void { this.rotation = rotation; this.isRequiredRecalculation = true; }
    getWorldPosition(): Vector3 { /* worldMatrixの平行移動成分(0,3)/(1,3)/(2,3)を抽出 */ }

    private calculateLocalMatrix(): void {
        // identity → scale3D → rotateByQuaternion → translate3D の順で合成
    }
    private calculateWorldMatrix(parentMatrix): void {
        this.worldMatrix = parentMatrix === undefined ? this.localMatrix : MatrixCalculator.multiply(parentMatrix, this.localMatrix);
    }
}
```

`calculateLocalMatrix()`はスケール→回転→平行移動の順でアフィン変換を合成する定型の順序。`getWorldPosition()`は`worldMatrix`の平行移動成分から直接ワールド座標を取り出すため、`PointLightNode.getLightData()`（`docs/scene/light.md`参照）のようにライトの実位置を取得する用途で使われる。

各`SceneNode.update()`は`this.transform.updateMatrix(this.parent?.getTransform().getWorldMatrix())`を呼び、親のワールド行列を使って自身のワールド行列を再計算する——親の`isRequiredRecalculation`が立っていなくても、子が独自に`isRequiredRecalculation`を立てていれば子だけ再計算される（親子で独立したフラグ管理）。

### `Camera`

```ts
export class Camera {
    private cameraType: number;
    private viewMatrix: Matrix44;
    private projectionMatrix: Matrix44;
    private position: Vector3; private rotation: Quaternion;
    private near: number; private far: number; private fov: number;
    private viewportWidth: number; private viewportHeight: number;
    private up: Vector3; private forward: Vector3;

    constructor(cameraType = CameraType.Perspective, options: CameraOptions = {}, direction: CameraDirection = {}) {
        // options/directionから既定値付きで初期化（position既定(0,0,30)、near=0.1、far=100、fov=45、viewport=800x800、up=(0,1,0)、forward=(0,0,-1)）
        this.calculateProjectionMatrix();
        this.calculateViewMatrix();
    }

    setPosition(position: Vector3): void { this.position = position; this.calculateViewMatrix(); }
    setRotation(rotation: Quaternion): void { this.rotation = rotation; this.calculateViewMatrix(); }
    setViewport(width, height): void { /* heightが0ならthrow、再計算 */ }
    setCameraType(type: number): void { this.cameraType = type; this.calculateProjectionMatrix(); }
    getViewMatrix(): Matrix44 { return this.viewMatrix; }
    getProjectionMatrix(): Matrix44 { return this.projectionMatrix; }
    calculateEyeDirection(): Vector3 { /* viewMatrixの逆行列の第3列から視線方向を抽出 */ }

    private calculateViewMatrix(): void {
        const calcUp = QuaternionCalculator.rotateVector(this.rotation, this.up);
        const calcForward = QuaternionCalculator.rotateVector(this.rotation, this.forward);
        const target = this.position.add(calcForward);
        this.viewMatrix = MatrixCalculator.lookAt(this.position, target, calcUp);
    }
    private calculateProjectionMatrix(): void { /* Perspective/Orthographyで分岐 */ }
}
```

`Transform`とは独立した位置・回転（`Vector3`/`Quaternion`）を自前で保持し、`setPosition`/`setRotation`のたびに即座に`viewMatrix`を再計算する（`Transform`のような遅延評価フラグは持たない）。`calculateEyeDirection()`は`viewMatrix`の逆行列から視線方向ベクトルを抽出し、`PhongMaterial`（`docs/scene/material.md`参照）がフラグメントシェーダの鏡面反射計算用に使う。

`CameraType`は`Perspective: 0`/`Orthography: 1`という定数オブジェクトで、`Vector-Matrix`系や`RenderTag`のような「`as const` + Union型導出」パターンではなく、単なる`number`値の集合として定義されている点に注意（型としての`CameraType`独自Union型は無く、コンストラクタ引数は素の`number`）。

`calculateOrthographicMatrix()`は`orthoHeight = 1.0`固定でアスペクト比から`orthoWidth`を算出する簡易実装。

## 他モジュールとの関係

- **`scene/core.md` (`SceneNode`)**: 全ノードが`transform: Transform`を1つ保持する。
- **`scene/renderer.md` (`RendererContext`)**: `Camera`は`setCamera()`で直接セットされ、UBO転送・`PhongMaterial`の`calculateEyeDirection()`呼び出しに使われる。
- **`math/math.md`**: `Matrix44`/`Quaternion`/`Vector3`/`MatrixCalculator`/`QuaternionCalculator`に全面的に依存する。

## 既知の制約・未完成部分

特になし（このサブシステム自体は比較的枯れている）。
