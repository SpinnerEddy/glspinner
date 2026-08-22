# math — ベクトル・行列・クォータニオンの値型と計算ユーティリティ

## 概要

`src/math/`は、glspinner全体で使われる数値計算の基盤層。`Vector2/3/4`・`Matrix22/33/44`という自己参照ジェネリクス（CRTP風）のインスタンス型群と、`VectorCalculator`/`MatrixCalculator`/`QuaternionCalculator`/`MathUtility`という静的ユーティリティ群の2系統が並存する。前者は「自分自身に対する演算」（`vector.add(other)`）、後者は「任意の2値を受け取るジェネリック演算」（`VectorCalculator.add(a, b)`）を提供し、機能はかなりの部分で重複している。

## 主要クラス一覧

| クラス/ファイル | 役割 | 備考 |
|---|---|---|
| `vector/VectorOperation.ts` | ベクトル演算の契約インターフェース | ジェネリック`<T>` |
| `vector/Vector.ts` | 抽象基底 | `Vector<T extends Vector<T>>`という自己参照ジェネリクス |
| `vector/Vector2.ts` / `Vector3.ts` / `Vector4.ts` | 2/3/4次元ベクトル具象クラス | `components: Float32Array`が実体 |
| `vector/VectorConstants.ts` | 軸定数・サイズ→クラスのマップ | `DefaultVectorConstants`, `VectorClassAndSizePair` |
| `VectorCalculator.ts` | ジェネリックなベクトル演算の静的関数群 | `<T extends Vector<T>>`で全次元共通実装 |
| `matrix/MatrixOperation.ts` | 行列演算の契約インターフェース | ジェネリック`<T>` |
| `matrix/Matrix.ts` | 抽象基底 | `Matrix<T extends Matrix<T>>` |
| `matrix/Matrix22.ts` / `Matrix33.ts` / `Matrix44.ts` | 2x2/3x3/4x4行列具象クラス | `Matrix44`のみ`perspective`/`orthographic`/`lookAt`等の3D変換ヘルパーを持つ |
| `matrix/MatrixConstants.ts` | サイズ→クラスのマップ | `MatrixClassAndSizePair` |
| `MatrixCalculator.ts` | ジェネリックな行列演算の静的関数群 | サイズ不一致は`throw`で検出 |
| `quaternion/Quaternion.ts` | クォータニオンの値クラス | `Vector`/`Matrix`とは異なり自己参照ジェネリクスなしの独立クラス |
| `QuaternionCalculator.ts` | クォータニオン演算の静的関数群 | `slerp`/`rotateVector`/`createFromAxisAndRadians`等 |
| `MathUtility.ts` | 三角関数・角度変換・数値ユーティリティ | `sin`/`cos`/`tan`等はEPSILON丸め込み付き |
| `ValueConstants.ts` | 数値定数 | `DefaultValueConstants.EPSILON`, `TrigonometricConstants` |

## アーキテクチャ・設計パターン

### 自己参照ジェネリクス（CRTP風パターン）

```ts
export interface VectorOperation<T> {
    add(other: T, out?: T): T;
    sub(other: T, out?: T): T;
    // ...
    clone(): T;
}

export abstract class Vector<T extends Vector<T>> implements VectorOperation<T> {
    protected components: Float32Array;
    get values(): Float32Array { return this.components; }
    get size(): number { return this.components.length; }
    get(index: number): number { return this.components[index]; }
    abstract add(other: T, out?: T): T;
    // ...
}

export class Vector2 extends Vector<Vector2> { /* ... */ }
```

`Vector<T extends Vector<T>>`という自己参照ジェネリクスにより、`Vector2`が`Vector<Vector2>`を継承する形になり、`add(other: T)`のようなメソッドが「同じ具象型同士でしか演算できない」ことを型レベルで保証する。全メソッドが`(other: T, out?: T): T`という「結果を書き込む先を省略可能な引数で受け取る」シグネチャで統一されており、`out`省略時は`this.create()`で新規インスタンスを生成して返す。`Matrix<T extends Matrix<T>>`も同型のパターン。

`Vector2`/`Vector3`/`Vector4`は`get x()`/`set x()`のようなアクセサ形式のプロパティを持つ（`Transform`等の`getXxx()/setXxx()`メソッド形式とは異なる書き方）。

### `~Calculator`静的ユーティリティとの機能重複

`VectorCalculator.add<T extends Vector<T>>(a, b)`のようなジェネリック静的メソッドは、内部で`a.values.map(...)`のような`Float32Array`直接操作をした上で`convertVector()`（サイズからクラスを引いて`new`し直す）を呼ぶ。一方、`Vector2.add(other, out)`のようなインスタンスメソッドは`components`を直接書き換える。両者は同じ計算を異なる経路で提供しており、`VectorConstants.ts`の`VectorClassAndSizePair`（サイズ→クラスのマップ）が`VectorCalculator`側の型復元に使われる。

`MatrixCalculator`も同様の構造で、`checkSizeEqual()`によるサイズ検証（不一致時は`console.log`でサイズを出力してから`false`を返す）と`createMatrixInstance()`（`MatrixClassAndSizePair`からのインスタンス生成）を経由する。`Matrix44`固有の3D変換系メソッド（`translate3D`/`rotate3D`/`rotateByQuaternion`/`scale3D`/`perspective`/`orthographic`/`lookAt`）は`MatrixCalculator`側にも同名の薄いラッパーが用意されている。

### `Quaternion`は自己参照ジェネリクスパターンの対象外

`Quaternion`は`Vector`/`Matrix`と異なり独立したクラスで、`x`/`y`/`z`/`w`のgetterと`toMatrix()`/`toEuler()`のみを持つ薄い値クラス。四則演算・正規化・球面線形補間（`slerp`）・軸回転生成（`createFromAxisAndRadians`）などの演算はすべて`QuaternionCalculator`の静的メソッドとして提供され、`Quaternion`自身にはインスタンスメソッドとしての演算がほとんど無い（`Vector`/`Matrix`が両系統を持つのとは対照的）。

## 主要クラス詳細

### `Vector2`/`Vector3`/`Vector4`共通の演算セット

`min`/`max`（長さ比較で選ぶ）、`add`/`sub`/`multiply`/`div`、`setLength`/`limit`/`normalize`、`calcDistance`/`calcAngle`（`aLen == 0 || bLen == 0`のとき`throw`）、`dot`/`length`（いずれも`values.reduce`で次元非依存に実装）、`lerp`、`clone`が共通。次元固有の追加メソッド:
- `Vector2.heading2D()`: `MathUtility.atan2(y, x)`で角度を返す。
- `Vector3.cross(other, out)`: 外積。`Vector3.heading3D()`: `[elevation, azimuth]`のタプルを返す。

### `Matrix44`（3D変換の主力）

`identity`/`add`/`sub`/`multiply`（行列積・スカラー積のオーバーロード）/`div`/`transpose`/`inverse`（余因子展開によるフル4x4逆行列、行列式0なら空行列を返す）に加え、`orthographic`/`perspective`/`lookAt`という3Dカメラ行列生成、`translate2D`/`translate3D`/`rotateX`/`Y`/`Z`/`rotate2D`/`rotate3D`/`rotateByQuaternion`/`scale2D`/`scale3D`という変換合成メソッド群を持つ。回転行列生成は内部で`createRotateMatrix3D()`（軸の参照等価性`axis == DefaultVectorConstants.AXIS2DX`で判定）を使う。`Matrix22`/`Matrix33`は次元が小さい以外は同型のAPI構成。

### `QuaternionCalculator`

`create`/`createFromEuler`/`createFromAxisAndRadians`/`identity`という生成系、`add`/`sub`/`multiply`/`scale`/`dot`/`conjugate`/`normalize`/`inverse`という基本演算、`rotateVector`（`Vector3`/`Vector4`両対応のオーバーロード、クォータニオン共役を使ったベクトル回転）、`slerp`（球面線形補間、`sinTheta == 0`のときは線形補間にフォールバック）を持つ。

### `MathUtility`

`degreesToRadians`/`radiansToDegrees`、`clamp`/`saturate`、`sin`/`cos`/`tan`/`exp`/`acos`/`atan2`（いずれも`roundToZero()`でEPSILON=1e-6未満の値を0に丸める）、`fract`/`ceil`、`linearStep`、`timeToBeat`/`beatToTime`（BPM⇔秒変換）、`calculateGaussianCoefficients(range, count)`（`BlurMaterial`のガウシアンカーネル係数生成に使用、`docs/scene/material.md`参照）を持つ。

## 他モジュールとの関係

- **`scene/transform-camera.md` (`Transform`/`Camera`)**: `Matrix44`をワールド行列・view/projection行列として保持する。
- **`scene/material.md`**: `PhongMaterial`が`Matrix44.inverse()`、`GouraudMaterial`が同様に逆行列を使う。`QuaternionCalculator.createFromAxisAndRadians()`は`examples/sample.ts`のオブジェクト回転アニメーションで使われる。
- **`webgl/gl.md` (`ShaderUniformValue`)**: `Vector`/`Matrix`の`values`/`toArray()`（`Float32Array`）がそのままUniform転送用データになる。

## 既知の制約・未完成部分

`Vector<T>`インスタンスメソッドと`VectorCalculator`（`Matrix`/`MatrixCalculator`も同様）の間に明確な使い分けの指針は無く、機能が重複している。新規コードを書く際は既存の呼び出し箇所がどちらを使っているかで判断する必要がある。
