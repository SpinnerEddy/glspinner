# GLSLシェーダー規約（`src/webgl/shader/`）

`src/webgl/shader/*.vert`/`*.frag`配下、24ファイル。他のファミリー（`~Material`, `~Device`等）と違い`XxxOperation`+`BaseXxx`というTypeScriptのクラス構造は存在しない（GLSLソースファイルの集合のため）。ユーザーの指示により独立したファミリーファイルとして扱う。共通する構成・命名パターンと、コピペで増えた結果生じた「揺れ」の両方を正直に記録する。

## 対象範囲

`ShaderLoader.loadCommonShaders()`（`src/webgl/gl/ShaderLoader.ts`）が`import.meta.glob('@webgl/shader/*.vert', ...)`/`import.meta.glob('@webgl/shader/*.frag', ...)`で自動ロードする、ライブラリ本体のシェーダー群のみが対象:

```
default / unlit / texture / framebuffer / text
gouraudLighting / phongLighting
grayScale / mosaic / rgbShift / glitch / blur / bright / compose
```

各名前に`.vert`/`.frag`のペアがある（14組28ファイル中、`default`/`unlit`は`.frag`が同一内容）。

**`examples/shader/`配下（`audio`/`sessions`/`spinner`/`ubotest`の4ペア）は対象外**。これは単なる恣意的な線引きではなく、コード上の実際の境界と一致する——`examples/shader/`のシェーダーは上記の自動ロードには載らず、`examples/sample.ts`側で`shaderLoader.loadShaderFromSource(key, vertSource, fragSource)`により個別に読み込まれる別カテゴリ（開発用サンドボックスの実験的な書き方が許容されている）。新規にライブラリ本体のシェーダーを追加する場合は`src/webgl/shader/`に置き、`examples/`配下の書き方を手本にしない。

## 共通テンプレート（24ファイル中22ファイルがほぼ準拠）

`layout(std140) uniform GlobalUniforms`ブロックを使う12本の`.vert`は、以下がバイト単位で完全一致している（`unlit.vert`が典型例）:

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

`// binding = 0 を削除`というコメントは全12ファイルにそのままコピーされている、過去の実装（明示的に`binding = 0`を書いていた頃）の名残とみられる注記。意味は無くなっているが削除されずに引き継がれている（`general.md`「無効化したコードは削除せずコメントアウトで残す」運用と同種の扱いと考えられる）。

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

共通する骨格:

- 1行目`#version 300 es`。fragmentのみ2行目に`precision highp float;`（vertexには書かない）
- `in`（attribute/varying）→ 必要なら`layout(std140) uniform GlobalUniforms`ブロック → 個別`uniform` → `out` → （必要ならヘルパー関数）→ `main()`、という宣言順
- インデントは4スペース
- `void main(void){`（`(void)`を明記し、`)`と`{`の間に空白を入れない）
- brace styleはK&R（開き括弧は同じ行）

## 命名規則

- **attribute**: `aXxx`接頭辞（`aPosition`, `aColor`, `aUv`, `aNormal`）
- **varying**（vert→fragで受け渡す`in`/`out`）: `vXxx`接頭辞（`vColor`, `vUv`, `vPosition`, `vNormal`）
- **uniform**: 接頭辞なしのcamelCase（`modelMatrix`, `shiftOffset`, `brightThreshold`, `glitchCoef`, `mosaicSize`, `fontColor`, `smoothness`, `bloomStrength`, `lightDirection`, `eyeDirection`, `ambientColor`等）
- **fragmentの最終出力**: 変数名は必ず`outputColor`（`out vec4 outputColor;`）で統一されている

## ヘルパー関数の配置パターン

`uniform`宣言（またはGlobalUniformsブロック）と`main()`の間に、その`.frag`固有の計算を切り出したヘルパー関数を置くのが定型。新規にポストエフェクトを追加する際もこの位置に置く:

```glsl
// mosaic.frag
vec2 boxelUv(vec2 uv, float size){
    uv *= size;
    vec2 iPos = floor(uv);
    iPos /= size;
    return iPos;
}

void main(void){
    ...
}
```

同種の例: `text.frag`の`median()`、`compose.frag`の`toLinear()`/`toGamma()`、`glitch.frag`の`rand()`/`offset()`、`phongLighting.frag`の`calculateInvLight()`。

## このファミリー固有の揺れ・例外

24ファイルはコピー＆ペーストで増えてきた形跡が強く、以下の揺れが実際に残っている。修正するかどうかは別途判断するとして、まず存在を隠さず記録する。

1. **タブ混入**: `blur.frag`・`glitch.frag`にタブ文字が混入している。`glitch.frag`は同一ファイル内でタブとスペースが混在している（TS側の`UnlitMesh.ts`のタブ混入1箇所と同種の事例）。
2. **`main()`シグネチャの例外**: `blur.frag`だけ`void main() {`（`void`引数を省略し、`{`の前に空白がある）という書き方。他23ファイルは`void main(void){`。
3. **brace styleの例外**: `blur.frag`の`if`/`else`ブロックだけAllman style（開き括弧が次の行）。他のファイルはK&R styleで統一されている。
4. **`GlobalUniforms`を使わない構造的な例外**: `gouraudLighting.vert`/`phongLighting.vert`は`layout(std140) uniform GlobalUniforms`ブロックを使わず、`mvpMatrix`/`modelMatrix`を個別の`uniform`として受け取る古いスタイル。他の12本の`.vert`とは構造が異なる（詳細は下記「コード側の要件」参照）。
5. **ヘルパー関数のブレース前空白が不統一**: `functionName(){`（空白なし、例: `boxelUv()`, `rand()`）と`functionName() {`（空白あり、例: `median()`, `toLinear()`, `toGamma()`, `offset()`）が混在している。
6. **`const`と`out`の宣言順序が不統一**: `bright.frag`は`const vec3 brightCoef`を`out vec4 outputColor`より先に書いているが、ほぼ同種の輝度計算をする`grayScale.frag`は逆順（`out`が先）。
7. **末尾空白**: `glitch.frag`・`phongLighting.frag`に行末の余分な空白が残っている。
8. **バイト単位での完全重複**: `.vert`は14ファイル中12ファイル（`blur`/`bright`/`compose`/`default`/`framebuffer`/`glitch`/`grayScale`/`mosaic`/`rgbShift`/`text`/`texture`/`unlit`）が完全に同一内容。`.frag`も14ファイル中3ファイル（`default`/`gouraudLighting`/`unlit`）が完全に同一内容。スタイルの揺れではなくDRYの観点の指摘だが、`ShaderLoader`がファイル単位でしかロードしない設計（後述）と表裏一体の状態なので記録しておく。

これらのうち1〜3・5〜7はPrettier/lint相当のツールが無いことに起因する典型的な「機械整形すれば消える揺れ」、4・8は設計判断が絡む（軽々に一括修正すべきでない）区別が必要な事項。

## コード側の要件（規約ではなく実装上の制約）

以下はスタイルの好みではなく、崩すと実際に動かなくなる/意図通り配線されなくなる制約:

- **ファイル名がシェーダーキーになる**: `ShaderLoader.loadCommonShaders()`はファイル名（拡張子抜き）をそのままシェーダーキーとして使う（`blur.vert`+`blur.frag` → キー`"blur"`）。vert/fragはファイル名を一致させる必要があり、このキーは`MaterialFactory`側の生成メソッドが参照するキー名とも一致していなければならない。新規シェーダーを追加する場合、`ShaderLoader`側のコード変更は不要な代わりに、ファイル名の対応関係を崩さないよう注意する（`material.md`「Factoryとの関係」参照）。
- **`GlobalUniforms`はマジックストリング**: `src/webgl/gl/ShaderProgram.ts`の`createProgram()`が`gl.getUniformBlockIndex(program, 'GlobalUniforms')`という文字列リテラルで直接検索し、見つかった場合のみ`UniformBindingPoint.GLOBAL`へバインドする（`buffer.md`「UBO専用の`ShaderUniformBuffer`」節参照）。UBO経由でview/projection行列・time・resolutionを自動的に受け取りたい場合は、ブロック名を寸分違わず`GlobalUniforms`にする必要がある。前述の`gouraudLighting`/`phongLighting`のようにこのブロックを持たないシェーダーは、この自動配線の恩恵を受けられず個別uniformで代替している。

## 他ファミリーとの関係

- **`material.md`**: 各`.vert`/`.frag`ペアは対応する`~Material`（`UnlitMaterial`, `TexturedMaterial`, `GrayScaleMaterial`等）から`MaterialFactory`経由で生成・使用される。シェーダー側の`uniform`名は、対応する`~Material.setUniform()`が`context.getGlobalUniform()`や固有ロジックで設定する値の名前と一致していなければならない。
- **`buffer.md`**: `GlobalUniforms`ブロックの中身（`viewMatrix`/`projectionMatrix`/`time`/`resolution`の4つ）は`ShaderUniformBuffer`が毎フレーム転送するデータそのもの。シェーダー側でブロックのメンバー構成を変える場合は`RendererContext`側の`ShaderUniformBuffer`構成も合わせて変更する必要がある。
- **`pipeline.md`**: `RendererContext.bindGlobalUniforms()`が`UniformBindingPoint.GLOBAL`（binding=0）へバッファをバインドする側。シェーダー側の`GlobalUniforms`マジックストリングとペアで初めてグローバルUniformの自動配線が成立する。
