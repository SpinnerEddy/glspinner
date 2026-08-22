# webgl/shader — GLSLシェーダー集（WebGL2, GLSL ES 3.00）

## 概要

`src/webgl/shader/`は、TypeScriptのクラス構造とは無関係な唯一のサブシステムで、24個の`.vert`/`.frag`ファイル（12ペア相当+`phongLighting`/`gouraudLighting`を含む14ペア構成）からなる。`ShaderLoader.loadCommonShaders()`（`docs/webgl/gl.md`参照）が`import.meta.glob`で自動ロードし、ファイル名（拡張子抜き）がそのままシェーダキーになる。WebGL2ベースで、全ファイルが`#version 300 es`から始まる。

## 主要ファイル一覧

| 名前 | 用途 | GlobalUniforms使用 |
|---|---|---|
| `default` | 汎用の最小シェーダ | ✓ |
| `unlit` | ライティングなし単色描画 | ✓ |
| `texture` | テクスチャ貼り付け | ✓ |
| `framebuffer` | オフスクリーンRT内容の描画 | ✓ |
| `text` | SDFテキストレンダリング | ✓（vert） |
| `phongLighting` | フォンシェーディング（フラグメント単位、複数光源対応） | ✓ |
| `gouraudLighting` | グーローシェーディング（頂点単位） | ✓ |
| `grayScale` | ポストエフェクト: グレースケール | ✓（vert） |
| `mosaic` | ポストエフェクト: モザイク | ✓（vert） |
| `rgbShift` | ポストエフェクト: RGBずらし | ✓（vert） |
| `glitch` | ポストエフェクト: グリッチ（`time`をfragでも参照） | ✓（vert+frag） |
| `blur` | ポストエフェクト: ガウシアンブラー（片方向） | vertのみ（fragは未使用） |
| `bright` | ポストエフェクト: 輝度抽出 | ✓（vert） |
| `compose` | ポストエフェクト: ブルーム合成（2テクスチャ） | ✓（vert） |

各名前に`.vert`/`.frag`のペアがある。`examples/shader/`配下（audio/sessions/spinner/ubotest）は開発用サンドボックスのため対象外——`ShaderLoader`の自動ロードには載らず、`loadShaderFromSource()`で個別に読み込まれる別カテゴリ。

## 共通テンプレート

12本の`.vert`（`default`/`unlit`/`texture`/`framebuffer`/`text`/`grayScale`/`mosaic`/`rgbShift`/`glitch`/`blur`/`bright`/`compose`）はバイト単位で完全一致する:

```glsl
#version 300 es

layout(std140) uniform GlobalUniforms { // binding = 0 を削除
    mat4 viewMatrix;
    mat4 projectionMatrix;
    float time;
    vec2 resolution;
};

in vec3 aPosition;
in vec4 aColor;
in vec2 aUv;

out vec4 vColor;
out vec2 vUv;

uniform mat4 modelMatrix;

void main(void){
    vColor = aColor;
    vUv = aUv;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(aPosition, 1.0);
}
```

`// binding = 0 を削除`というコメントは全12ファイルにそのままコピーされている、過去の実装（明示的に`binding = 0`を書いていた頃）の名残とみられる注記——意味は無くなっているが削除されずに引き継がれている。

`.frag`側の典型例（`texture.frag`）:

```glsl
#version 300 es
precision highp float;

in vec4 vColor;
in vec2 vUv;

uniform sampler2D tex;

out vec4 outputColor;

void main(void){
    vec4 texColor = texture(tex, vUv);
    outputColor = vColor * texColor;
}
```

ポストエフェクト系の`.frag`はほぼ全て`vec2 uv = vec2(vUv.x, 1.0 - vUv.y);`でY軸反転してからサンプリングする、という定型の1行を持つ（`grayScale`/`mosaic`/`rgbShift`/`glitch`/`blur`/`bright`/`compose`/`framebuffer`共通）。

共通する骨格:
- 1行目`#version 300 es`。fragmentのみ2行目に`precision highp float;`
- `in`→（必要なら`GlobalUniforms`ブロック）→個別`uniform`→`out`→（必要ならヘルパー関数）→`main()`
- インデントは4スペース基本
- `void main(void){`（`(void)`明記、`)`と`{`の間に空白なし）
- brace styleはK&R（開き括弧は同じ行）

## 命名規則

- **attribute**: `aXxx`（`aPosition`, `aColor`, `aUv`, `aNormal`）
- **varying**: `vXxx`（`vColor`, `vUv`, `vPosition`, `vNormal`）
- **uniform**: 接頭辞なしcamelCase（`modelMatrix`, `shiftOffset`, `brightThreshold`, `glitchCoef`, `mosaicSize`, `fontColor`, `smoothness`, `bloomStrength`, `lightDirection`, `eyeDirection`, `ambientColor`, `shininess`等）
- **fragmentの最終出力**: `out vec4 outputColor;`で統一

## ヘルパー関数の例

`.frag`固有の計算は`uniform`宣言（またはGlobalUniformsブロック）と`main()`の間に置くのが定型:

```glsl
// mosaic.frag
vec2 boxelUv(vec2 uv, float size){
    uv *= size;
    vec2 iPos = floor(uv);
    iPos /= size;
    return iPos;
}
```

同種の例: `text.frag`の`median()`（3チャンネルの中央値でSDFを合成）、`compose.frag`の`toLinear()`/`toGamma()`（sRGB⇔リニア変換、ガンマ2.2）、`glitch.frag`の`rand()`/`offset()`（疑似乱数生成）、`phongLighting.frag`の`calculateLight()`/`calculateDirectionalLight()`/`calculatePointLight()`。

## `phongLighting`（複数光源対応のフォンシェーディング）

`.vert`はワールド座標(`vPosition`)・頂点色・法線をvaryingとして渡すのみ（ライティング計算はしない）。`.frag`側で以下を実装している:

```glsl
#define MAX_POINT_LIGHTS 8
#define MAX_DIRECTIONAL_LIGHTS 8

struct PointLight { vec3 position; vec4 color; float intensity; };
struct DirectionalLight { vec3 direction; vec4 color; float intensity; };
struct LightResult { vec3 diffuse; vec3 specular; };

uniform PointLight pointLights[MAX_POINT_LIGHTS];
uniform int pointLightCounts;
uniform DirectionalLight directionalLights[MAX_DIRECTIONAL_LIGHTS];
uniform int directionalLightCounts;
uniform vec4 ambientLightColor;

LightResult calculateLight(vec3 ld, vec3 lightColor, float intensity){
    // invMatrix経由でライト方向・視線方向をローカル空間へ変換し、diffuse(dot)とspecular(pow)を計算
}

void main(void){
    // directionalLights/pointLightsを配列ループで合算し、ambientLightColorを加算
}
```

TypeScript側の`PhongMaterial`（`docs/scene/material.md`参照）が送る`directionalLightCounts`/`pointLightCounts`（実際のライト数）でループを`min(..., MAX_XXX_LIGHTS)`にクランプしてから配列を走査する、という可変長ライト対応の実装になっている。`MAX_POINT_LIGHTS`/`MAX_DIRECTIONAL_LIGHTS`はTypeScript側の`LightConstants.ts`の同名定数と値が一致している必要がある（シェーダ側は`#define`、TS側は`export const`で、自動的に同期される仕組みは無い）。

`gouraudLighting`は単一の`lightDirection`/`eyeDirection`/`ambientColor`のみを受け取り、`.vert`側で全ライティング計算を行って`vColor`として渡す、より単純な構成（複数光源には対応していない）。

## このファミリー固有の揺れ・例外

コピー&ペーストで増えてきた形跡が強く、以下の揺れが実際に残っている:

1. **タブ混入**: `blur.frag`・`glitch.frag`にタブ文字が混入。`glitch.frag`は同一ファイル内でタブとスペースが混在。
2. **`main()`シグネチャの例外**: `blur.frag`だけ`void main() {`（`void`引数省略、`{`前に空白）。他は`void main(void){`。
3. **brace styleの例外**: `blur.frag`の`if`/`else`ブロックだけAllman style（開き括弧が次の行）。
4. **ヘルパー関数のブレース前空白が不統一**: `boxelUv(){`（空白なし）と`median() {`/`toLinear() {`（空白あり）が混在。
5. **`const`と`out`の宣言順序が不統一**: `bright.frag`は`const vec3 brightCoef`が`out vec4 outputColor`より先、`grayScale.frag`は逆順。
6. **末尾空白**: `glitch.frag`・`phongLighting.frag`に行末の余分な空白が残る。
7. **バイト単位での完全重複**: `.vert`は14本中12本が完全同一内容（DRY観点の指摘、`ShaderLoader`がファイル単位ロードのため表裏一体）。`.frag`も`default`/`gouraudLighting`/`unlit`の3本が完全同一（いずれも`outputColor = vColor;`のみ）。

これらは機械整形（Prettier/lint相当）が無いことに起因する典型的な揺れで、新規シェーダ追加時に無理に統一しようとせず、既存の多数派パターン（K&R style、4スペース）に合わせるのが無難。

## コード側の要件（規約ではなく実装上の制約）

- **ファイル名がシェーダーキーになる**: `blur.vert`+`blur.frag`→キー`"blur"`。vert/fragはファイル名を一致させる必要があり、`MaterialFactory`側の生成メソッドが参照するキー名とも一致していなければならない。
- **`GlobalUniforms`はマジックストリング**: `ShaderProgram.createProgram()`が`gl.getUniformBlockIndex(program, 'GlobalUniforms')`という文字列リテラルで直接検索する（`docs/webgl/gl.md`参照）。ブロック名を寸分違わず`GlobalUniforms`にする必要がある。

## 他モジュールとの関係

- **`scene/material.md`**: 各`.vert`/`.frag`ペアは対応する`~Material`から`MaterialFactory`経由で生成・使用される。シェーダー側の`uniform`名は対応する`~Material.setUniform()`が設定する値の名前と一致していなければならない。
- **`webgl/gl.md`**: `GlobalUniforms`ブロックの中身（`viewMatrix`/`projectionMatrix`/`time`/`resolution`の4つ）は`ShaderUniformBuffer`が毎フレーム転送するデータそのもの。
- **`scene/renderer.md`**: `RendererContext.bindGlobalUniforms()`が`UniformBindingPoint.GLOBAL`（binding=0）へバッファをバインドする側。

## 既知の制約・未完成部分

`MAX_POINT_LIGHTS`/`MAX_DIRECTIONAL_LIGHTS`はシェーダ側`#define`とTypeScript側`LightConstants.ts`の`export const`とで二重管理されており、片方だけ変更すると不整合になる（自動同期の仕組みなし）。
