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
    abstract updateUniforms(gl, context, transform: Transform): void;
    abstract draw(gl): void;
}
```

`useMaterial()`はマテリアルへの委譲を共通化。`updateUniforms()`と`draw()`が具象クラスの責務。

`MeshOperation`は以前`updateMaterialParams(gl, transform, context)`という追加メソッドを持ち、`SimpleMesh`だけがこれをオーバーライドしてPhongライティング用のパラメータ（`modelMatrix`の逆行列・視線方向・ライトUniform）を設定していた。2026-07のリファクタ（`material.md`「`PhongMaterial`/`GouraudMaterial`の自己完結化」参照）でこの責務は`PhongMaterial`自身に移り、`updateMaterialParams`は`MeshOperation`/`BaseMesh`から完全に削除された。今は`updateUniforms(gl, context, transform)`ひとつに統一されている。

## 具象クラスの役割分担

`SimpleMesh`/`UnlitMesh`/`TextMesh`/`FullScreenQuadMesh`はいずれも`updateUniforms()`が次の1行だけの同一パターンになった（マテリアル種別による差異は無い）。

```ts
updateUniforms(gl: WebGL2RenderingContext, context: RendererContext, transform: Transform): void {
    this.material.setUniform(gl, context, transform);
}
```

以前は`SimpleMesh`だけ`updateMaterialParams()`という追加メソッドで`PhongMaterial`固有の値を設定していたため他の3クラスと形が異なっていたが、その責務が`PhongMaterial`自身に移った（`material.md`参照）ことで、`SimpleMesh`も他の3クラスと構造上区別がつかなくなった。差異があるのは`draw()`側のみ:

- **`SimpleMesh`**: Phongライティング等、通常の3Dオブジェクト用。`draw()`は`geometry.bind() → gl.drawElements(TRIANGLES) → geometry.unbind() → material.cleanup()`という定型。
- **`UnlitMesh`**: ライティングなし。深度テスト有効・カリング無効を明示（ポストエフェクトのフルスクリーンプレーン描画にも使われる。`pass.md`の`BaseShaderPass`参照）。
- **`TextMesh`**: `TextQuad`ジオメトリ専用。アルファブレンド有効・深度テスト無効（常に手前に表示）。
- **`FullScreenQuadMesh`**: `draw()`に`material.cleanup()`呼び出しすら無い最小構成（フラグメントシェーダキャンバス用）。

いずれの具象クラスも`draw()`は`geometry.bind() → gl.drawElements(TRIANGLES, ...) → geometry.unbind() → material.cleanup()`という共通パターンを踏襲する（`FullScreenQuadMesh`を除く。`BaseMesh`側で共通化されていないため、新規追加時は手で複製することになる）。

## `~Node`ファミリーとの関係

`~Mesh`自体はシーングラフに属さない（`geometry`+`material`+描画ロジックのみを持つ）。シーングラフ上に配置するには`MeshNode`（`node.md`参照）でラップする。

## 変更履歴

- 2026-07-25: 「Material/Mesh Uniform受け渡し方式の統一リファクタ」（Notionタスク④）を反映。`MeshOperation.updateMaterialParams`の削除と`updateUniforms(gl, context, transform)`への統一により、`SimpleMesh`が他3クラスと同一のパターンになったことを反映して全面改訂した。
