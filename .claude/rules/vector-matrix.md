# `Vector`/`Matrix` ファミリー規約（数値ジェネリクス系）

`src/math/vector/`・`src/math/matrix/`配下。`operation-base.md`の標準形とは異なる、**このファミリー独自の二層構造**を持つ。ユーザーが挙げた例には含まれていないが、`Vector2`/`Vector3`/`Vector4`、`Matrix22`/`Matrix33`/`Matrix44`という明確な接尾辞（末尾の数字）を共有するファミリーのため独立ファイルとして扱う。

## 構成

- `VectorOperation<T>`（インターフェース） → `Vector<T extends Vector<T>>`（**`BaseVector`ではなく`Vector`という、インターフェースから`Operation`を除いた名前の抽象クラス**、`ClockOperation`→`Clock`と同型。`operation-base.md`「小規模ファミリー」参照）→ `Vector2`/`Vector3`/`Vector4`
- `MatrixOperation<T>`（インターフェース） → `Matrix<T extends Matrix<T>>`（同様に`Matrix`という名前の抽象クラス）→ `Matrix22`/`Matrix33`/`Matrix44`

## 自己参照ジェネリクス（CRTP風パターン）

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

`Vector<T extends Vector<T>>`という**自己参照ジェネリクス**（`Vector2`が`Vector<Vector2>`を継承する形）により、`add(other: T)`のようなメソッドが「同じ具象型同士でしか演算できない」ことを型レベルで保証している。`out?: T`という「結果を書き込む先を省略可能な引数で受け取る」シグネチャが全メソッドで統一されており、新規の演算メソッドを追加する場合もこの`(other: T, out?: T): T`という形に合わせる（`out`省略時は内部で新規インスタンスを生成して返す想定）。

`components: Float32Array`という単一のバッキングストアを持つ点、`get values()`/`get size()`/`get(index)`という最小限の共通実装のみを`Vector`が提供し、演算メソッド（`add`/`sub`/`normalize`等）は全て`abstract`という構成は、`~Device`や`~Buffer`と同じ「共通ロジックが薄いBase」型。

## `Matrix`ファミリーも同型

`Matrix<T extends Matrix<T>>`も同じ自己参照ジェネリクスパターンで、`Matrix22`/`Matrix33`/`Matrix44`がそれぞれ`Matrix<Matrix22>`等を継承する。

## getter/setter方式との関係

`Vector2`は`get x()`/`set x()`というアクセサ形式のプロパティを持つ（`general.md`「未解決・揺れがある事項」6番）。一方、`Transform`など他クラスは`getXxx()`/`setXxx()`というメソッド形式を使う。このファミリー（`Vector`/`Matrix`）は**アクセサ形式側の代表例**であり、新規に数値演算系の値オブジェクトを追加する場合はこのファミリーの流儀（アクセサ形式）に合わせるのが自然。一方、状態を持つ振る舞い中心のクラス（`Transform`のような）はメソッド形式に合わせる、という使い分けの目安になる。

## `~Calculator`/`~Utility`静的クラスとの関係

`VectorCalculator`/`MatrixCalculator`/`MathUtility`は`Vector`/`Matrix`インスタンスを受け取って計算する静的メソッド集で、`operation-base.md`「適用しない場面」に該当するため`Operation`/`Base`構造を持たない。このファミリーのインスタンスメソッド（`Vector2.add()`等）と、`VectorCalculator`の静的メソッドとで機能が重複していないか、新規追加時は既存の使い分けを確認すること（両方に同じ計算を生やさない）。
