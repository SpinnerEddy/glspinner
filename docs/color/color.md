# color — 2つの色表現とユーティリティ関数

## 概要

`src/color/`は、0〜1範囲の`Color`と0〜255範囲の`Color255`という2つの色表現を、相互変換メソッド付きで提供する小さなサブシステム。`ColorUtility`がHexカラーコード⇔`Color`/`Color255`の変換とHSV→RGB変換を静的メソッドとして持つ。`Operation+Base`パターンの対象外で、専用ファミリーファイルを持たない一回限りのクラス群として扱われる。

## 主要クラス一覧

| クラス/ファイル | 役割 | 備考 |
|---|---|---|
| `Color.ts` | 0〜1範囲のRGBA色 | シェーダのUniformにそのまま渡せる形式 |
| `Color255.ts` | 0〜255範囲のRGBA色 | `<input type="color">`やCSS Hexとの橋渡し用 |
| `ColorUtility.ts` | Hex文字列⇔Color変換、HSV→RGB変換 | 全メソッド静的 |
| `ColorConstants.ts` | 既定色・キャラクターカラーパレットの定数 | `DefaultColorConstants`, `MyColorConstants255`, `MyColorCode` |

## アーキテクチャ・設計パターン

`Color`（0〜1）と`Color255`（0〜255）が両方存在するのは用途の違いによる——`Color`はシェーダのUniform（`vec3`/`vec4`）へそのまま渡せる浮動小数点表現、`Color255`はHTMLの`<input type="color">`やCSS Hexコード、一般的な「RGB(0-255)」表記との橋渡し用の整数表現。両クラスは`translateTo255()`/`translateTo01()`という対になる変換メソッドを持ち、相互に行き来できる。

いずれのクラスもコンストラクタで`MathUtility.clamp()`により値域をクランプする（`Color`は`0.0〜1.0`、`Color255`は`0〜255`）。

## 主要クラス詳細

### `Color`

```ts
export class Color {
    private r: number; private g: number; private b: number; private a: number;
    constructor(r, g, b, a = 1.0) { /* 各値を0.0〜1.0にクランプ */ }

    static empty(): Color { return new Color(0, 0, 0, 0); }
    static isEmpty(color: Color): boolean { /* r/g/b/aすべて0か判定 */ }

    get red/green/blue/alpha(): number { ... }
    get toRGBArray(): Float32Array { return new Float32Array([r, g, b]); }
    get toRGBAArray(): Float32Array { return new Float32Array([r, g, b, a]); }
    getRgbToVector3(): Vector3 { ... }
    toVector4(): Vector4 { ... }
    translateTo255(): Color255 { /* Math.roundで整数化 */ }
}
```

`toRGBArray`/`toRGBAArray`はgetterアクセサ（メソッドではなくプロパティとして呼ぶ）。`toVector4()`/`getRgbToVector3()`で`math`モジュールの`Vector3`/`Vector4`へも変換でき、`PhongMaterial`（`docs/scene/material.md`参照）がライトの色を`Vector4`としてシェーダへ送る際にこの経路を使う。

### `Color255`

```ts
export class Color255 {
    constructor(r, g, b, a = 255) { /* 各値を0〜255にクランプ */ }
    get red/green/blue/alpha(): number { ... }
    translateTo01(): Color { /* 255で割ってtoFixed(3)で丸め、Colorへ変換 */ }
    translateToColorCode(): string { /* #RRGGBB形式のHex文字列に変換（アルファは含まない） */ }
}
```

### `ColorUtility`

```ts
export class ColorUtility {
    static hexToColor255(colorCode: string): Color255 {
        // /^#([0-9A-Fa-f]{6})$/ にマッチしない場合はMyColorConstants255.COLOR_EMPTYを返す
    }
    static hexToColor01(colorCode: string): Color { /* hexToColor255().translateTo01() */ }
    static hsvToRgb(hue, saturation, value, alpha): Color { /* HSV→RGB変換、範囲外なら空色を返す */ }
}
```

`hexToColor255()`は6桁Hex（`#RRGGBB`）のみに対応し、不正な文字列は例外を投げずに既定の空色定数へフォールバックする。`hsvToRgb()`は`saturation`/`value`/`alpha`のいずれかが1を超えると`Color.empty()`を返すガード付き。

### `ColorConstants`

`DefaultColorConstants`（RED/GREEN/BLUE/WHITE/BLACK）、`MyColorConstants255`（`COLOR_EMPTY`に加え、キャラクター名を冠した独自パレット10色余り）、`MyColorCode`（同じ色をHex文字列としても定義）という3つの定数オブジェクトを持つ。`MyColorConstants255`と`MyColorCode`は同じ色を2つの表現（`Color255`インスタンスとHex文字列）で二重に定義している。

## 他モジュールとの関係

- **`math/math.md`**: `Color.getRgbToVector3()`/`toVector4()`が`Vector3`/`Vector4`へ変換する。
- **`scene/material.md`**: `MaterialFactory.texturedTextMaterial()`が`ColorUtility.hexToColor01()`でフォント色を、`examples/sample.ts`が背景色を`ColorUtility.hexToColor01()`で変換する。
- **`scene/light.md`**: `LightFactory.light(color, intensity)`の`color`引数として`Color`を渡す。
- **`tools/tools.md`**: `RecordGuiController`等のGUIコントローラーが`lil-gui`の`addColor()`経由でHex文字列を扱う際の変換元・変換先になる。

## 既知の制約・未完成部分

`hexToColor255()`は6桁Hex（アルファなし）のみに対応し、8桁Hex（`#RRGGBBAA`）には対応していない。
