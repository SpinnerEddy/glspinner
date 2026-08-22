# scene/mesh — ジオメトリとマテリアルを束ねて描画するレイヤー

## 概要

`src/scene/mesh/`は「どのジオメトリを」「どのマテリアルで」「どう`gl.drawElements`するか」をまとめる薄い実行レイヤー。`MeshOperation`→`BaseMesh`→4具象クラスという`Operation+Base`パターンで、各具象クラスの違いはほぼ`draw()`内のGLステート設定（深度テスト・カリング・ブレンド）のみに集約されている。

## 主要クラス一覧

| クラス/ファイル | 役割 | 備考 |
|---|---|---|
| `MeshOperation.ts` | 契約インターフェース | `useMaterial`/`updateUniforms`/`draw`の3メソッド |
| `BaseMesh.ts` | 抽象基底 | `geometry`/`material`の保持と`useMaterial()`の委譲のみ共通化 |
| `SimpleMesh.ts` | 通常の3Dオブジェクト（Phong/Gouraud等） | 深度テスト有効、カリングは既定のまま |
| `UnlitMesh.ts` | ライティングなし描画 | 深度テスト有効・カリング無効。ポストエフェクトのフルスクリーンプレーンにも流用 |
| `TextMesh.ts` | `TextQuad`専用 | アルファブレンド有効・深度テスト無効（常に最前面） |
| `FullScreenQuadMesh.ts` | フラグメントキャンバス用 | `material.cleanup()`呼び出しすら省略した最小構成 |

## アーキテクチャ・設計パターン

`BaseMesh`はコンストラクタで`geometry: GeometryOperation`と`material: MaterialOperation`を受け取って保持し、`useMaterial(gl, context)`を`material.use(gl, context)`への委譲として共通化する。`updateUniforms(gl, context, transform)`と`draw(gl)`はいずれも`abstract`。

`updateUniforms()`は4クラスすべてで次の1行のみという同一パターンになっている（差異なし）:

```ts
updateUniforms(gl, context, transform): void {
    this.material.setUniform(gl, context, transform);
}
```

これは2026-07の「Uniform受け渡し方式の統一リファクタ」の結果で、以前は`SimpleMesh`だけが`updateMaterialParams()`という追加メソッドでPhongライティング用パラメータ（逆行列・視線方向・ライトUniform）を設定していたが、その責務が`PhongMaterial`自身（`docs/scene/material.md`参照）に移り、`MeshOperation`から`updateMaterialParams`は完全に削除された。結果として4クラスの差異は`draw()`のGLステート設定のみになっている。

## 主要クラス詳細

### `SimpleMesh`

```ts
draw(gl): void {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    this.geometry.bind();
    gl.drawElements(gl.TRIANGLES, this.geometry.getIndexCount(), gl.UNSIGNED_SHORT, 0);
    this.geometry.unbind();
    this.material.cleanup();
}
```

通常の3Dオブジェクト（`Box`/`Sphere`/`Torus`等 + `PhongMaterial`/`GouraudMaterial`/`UnlitMaterial`/`TexturedMaterial`等の組み合わせ）向け。深度テストを有効化するだけで、カリングは触らない（WebGLのデフォルト状態＝カリング無効のまま）。

### `UnlitMesh`

`SimpleMesh`に加えて`gl.disable(gl.CULL_FACE)`を明示する点のみが差分。ライティングなしの単純な描画に加え、`scene/renderer/postEffect`の`BaseShaderPass`がフルスクリーンの`Plane`ジオメトリを描画する際にもこのクラスが再利用される（`docs/scene/renderer.md`参照）。

### `TextMesh`

```ts
get resolution(): [number, number] {
    return (this.geometry as TextQuad).resolution;
}
draw(gl): void {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);
    ...
}
```

`TextQuad`ジオメトリ専用で、コンストラクタの型を`geometry: TextQuad`に狭めている（`BaseMesh`は`GeometryOperation`だが、`TextMesh`だけ具象型を要求する）。`resolution`という`MeshOperation`契約に無いgetterアクセサを追加で持ち、内部で`geometry`を`TextQuad`へキャストして委譲する。アルファブレンド有効・深度テスト無効という設定は、テキストが常に最前面（`RenderTag.OVERLAY`パス）で表示されることを前提にしている。

### `FullScreenQuadMesh`

```ts
draw(gl): void {
    this.geometry.bind();
    gl.drawElements(gl.TRIANGLES, this.geometry.getIndexCount(), gl.UNSIGNED_SHORT, 0);
    this.geometry.unbind();
}
```

4クラス中唯一`material.cleanup()`を呼ばない最小構成。`Rectangle`ジオメトリ専用（コンストラクタの型を`geometry: Rectangle`に狭めている）で、`FragmentCanvasMaterial`のようなテクスチャを持たないキャンバス用途を想定している。

## 他モジュールとの関係

- **`scene/core/node` (`MeshNode`/`TextMeshNode`)**: `~Mesh`自体はシーングラフに属さず、`MeshNode`/`TextMeshNode`（`docs/scene/core.md`参照）でラップして初めてシーングラフ上に配置できる。`MeshNode.draw()`は`useMaterial → updateUniforms → mesh.draw`という3行に処理を委譲するだけの薄いラッパー。
- **`scene/material`**: `material: MaterialOperation`として保持し、Uniform設定を完全に委譲する。
- **`webgl/gl/geometry`**: `geometry: GeometryOperation`として保持し、バインド/インデックス数取得を委譲する。
- **`scene/renderer/postEffect` (`BaseShaderPass`)**: フルスクリーンプレーン描画に`UnlitMesh`を再利用する。

## 既知の制約・未完成部分

`draw()`の「`geometry.bind()` → `gl.drawElements(TRIANGLES,...)` → `geometry.unbind()` → `material.cleanup()`」という4行パターンは`BaseMesh`側で共通化されておらず、`FullScreenQuadMesh`を除く3クラスがそれぞれ手で複製している（重複だが意図的に手を付けられていない状態）。
