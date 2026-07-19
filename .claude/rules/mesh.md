# `~Mesh` ファミリー規約

`src/scene/mesh/`配下。`XxxOperation`+`BaseXxx`の標準形。

## 構成

- `MeshOperation`（インターフェース）
- `BaseMesh`（抽象基底）
- 具象クラス4個: `SimpleMesh`, `UnlitMesh`, `TextMesh`, `FullScreenQuadMesh`

## `BaseMesh`が提供する共通実装

```ts
export abstract class BaseMesh implements MeshOperation {
    protected geometry: GeometryOperation;
    protected material: MaterialOperation;
    useMaterial(gl, context) { this.material.use(gl, context); }
    updateMaterialParams(...) { /* デフォルトは何もしない */ }
    abstract updateUniforms(gl, context): void;
    abstract draw(gl): void;
}
```

`useMaterial()`はマテリアルへの委譲を共通化。`updateMaterialParams()`はデフォルトで空実装（オーバーライドしなくてもよい）。`updateUniforms()`と`draw()`が具象クラスの責務。

## 具象クラスの役割分担

- **`SimpleMesh`**: Phongライティング等、通常の3Dオブジェクト用。`updateMaterialParams()`で`modelMatrix`の逆行列・視線方向・ライトUniformをまとめて設定する（下記コード参照）。`draw()`は`geometry.bind() → gl.drawElements(TRIANGLES) → geometry.unbind() → material.cleanup()`という定型。
- **`UnlitMesh`**: ライティングなし。深度テスト有効・カリング無効を明示（ポストエフェクトのフルスクリーンプレーン描画にも使われる。`pass.md`の`BaseShaderPass`参照）。
- **`TextMesh`**: `TextQuad`ジオメトリ専用。アルファブレンド有効・深度テスト無効（常に手前に表示）。
- **`FullScreenQuadMesh`**: `updateMaterialParams`すら使わない最小構成（フラグメントシェーダキャンバス用）。

```ts
// SimpleMesh.updateMaterialParams()
updateMaterialParams(gl, transform, context): void {
    const modelMatrix = transform.getWorldMatrix();
    const invertMatrix = modelMatrix.inverse();
    const eyeDirection = context.getCamera().calculateEyeDirection();

    let uniforms = context.getGlobalUniform();
    uniforms["modelMatrix"] = new ShaderUniformValue(modelMatrix);
    uniforms["invMatrix"] = new ShaderUniformValue(invertMatrix);
    uniforms["eyeDirection"] = new ShaderUniformValue(eyeDirection);

    const phong = this.material as PhongMaterial;
    if (phong == null) return;
    if (context.getLights().length == 0) return;

    let light = context.getLights().at(0)!;
    phong.setLightUniform(gl, light);
}
```

`this.material as PhongMaterial`のダウンキャストは、`material.md`で触れた「`MaterialOperation`の契約に現れないファミリー固有メソッドを呼ぶための非対称な拡張点」の具体例。`phong == null`という`==`比較（`===`ではない）で判定している点も既存コードの流儀。

いずれの具象クラスも`draw()`は`geometry.bind() → gl.drawElements(TRIANGLES, ...) → geometry.unbind() → material.cleanup()`という共通パターンを踏襲する（`BaseMesh`側で共通化されていないため、新規追加時は手で複製することになる）。

## `~Node`ファミリーとの関係

`~Mesh`自体はシーングラフに属さない（`geometry`+`material`+描画ロジックのみを持つ）。シーングラフ上に配置するには`MeshNode`（`node.md`参照）でラップする。
