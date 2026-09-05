# GouraudMaterial/gouraudLighting.vertをPhongMaterialの実装に揃える

**ステータス**: 提案（未実装）
**対象**: `src/scene/material/GouraudMaterial.ts`, `src/scene/factory/MaterialFactory.ts`, `src/webgl/shader/gouraudLighting.vert`

## Context（なぜこの変更をするか）

2026-07の「Material/Mesh Uniform受け渡し方式の統一リファクタ」で`PhongMaterial`は`context.getCamera()`/`context.getLights()`から必要な値を自己完結して取得する形に書き換わり、複数光源（Directional/Point/Ambient）にも対応した（`.claude/rules/material.md`「`PhongMaterial`/`GouraudMaterial`の自己完結化」節）。このとき`GouraudMaterial`は同じ方針を採るかどうか意図的に据え置かれ、`.claude/rules/material.md`に「揺れとして記録するに留める」既知の未整合として明記されている。

現状の`GouraudMaterial.ts`は以下の旧方式のままになっている:

- `lightDirection`/`eyeDirection`/`ambientColor`をコンストラクタ引数+setter（`setLightDirection`/`setEyeDirection`/`setAmbientColor`）で外部から注入する（`GouraudMaterial.ts:10-18, 32-42`）。
- `setUniform()`の第2引数は使われないため`_context`という命名になっている（`GouraudMaterial.ts:21`）。
- ライトは単一のDirectional相当1つのみで、Point Lightに対応していない。
- `shininess`パラメータが無く、`gouraudLighting.vert`側にspecular power（`50.0`）がハードコードされている（`gouraudLighting.vert:27`）。

一方`gouraudLighting.frag`は`outputColor = vColor;`という単純パススルーのみ（`gouraudLighting.frag:8`）。Gouraud shadingは頂点段階でライティング計算を確定させ補間するのが本来の構造であり、この点自体はPhong（フラグメント段階でライティング計算する）との意図的な違いなので揃えない。

今回はこの既知の未整合を解消し、`GouraudMaterial`/`gouraudLighting.vert`を`PhongMaterial`/`phongLighting.frag`と同じライト取得・複数光源対応の構造に揃える。

## 決定事項（会話で合意済み）

| 論点 | 決定 |
|---|---|
| ライト値の取得方法をPhongと揃えるか | 揃える。`context.getCamera().calculateEyeDirection()`/`context.getLights()`から自己完結して取得する方式に統一する |
| Point Lightに対応するか | 対応する。`PhongMaterial`と同じ`LightType`フィルタ＋配列uniformの構成にする |
| `shininess`を外部からの調整可能パラメータにするか | する。`PhongMaterial.setShininess()`と同型の`setShininess()`を追加する |
| `gouraudLighting.frag`を変更するか | しない。Gouraud shadingとして頂点段階で色を確定させフラグメント側は補間結果を出すだけ、という構造は設計上正しいため |
| ヘルパー関数（`calculateLight`等）でvNormal/vPositionをフラグメント側同様グローバル参照にするか、明示的な引数にするか | 明示的な引数にする。フラグメントシェーダの`vNormal`/`vPosition`は`in`宣言された varying でありシェーダ内のどこからでも参照できる値だが、頂点シェーダには対応する varying が存在しないため、`main()`内でワールド座標をローカル変数として計算し、法線（`aNormal`）とともにヘルパー関数へ引数として渡す形にする |

## 設計

### `GouraudMaterial.ts`

`PhongMaterial.ts`の構造をほぼそのまま移植する。

```ts
export class GouraudMaterial extends BaseMaterial {
    private shininess: number;

    constructor(shaderProgram: ShaderProgram, shininess: number) {
        super(shaderProgram);
        this.shininess = shininess;
    }

    setUniform(gl: WebGL2RenderingContext, context: RendererContext, transform: Transform): void {
        const modelMatrix = transform.getWorldMatrix();
        const invertMatrix = modelMatrix.inverse();
        const eyeDirection = context.getCamera().calculateEyeDirection();

        this.shaderProgram.setUniform(gl, 'modelMatrix', new ShaderUniformValue(modelMatrix));
        this.shaderProgram.setUniform(gl, 'invMatrix', new ShaderUniformValue(invertMatrix));
        this.shaderProgram.setUniform(gl, 'eyeDirection', new ShaderUniformValue(eyeDirection));
        this.shaderProgram.setUniform(gl, 'shininess', new ShaderUniformValue(this.shininess));

        if (context.getLights().length == 0) return;

        this.setLightUniforms(gl, context.getLights());
    }

    setShininess(shininess: number): void {
        this.shininess = shininess;
    }

    // 以下、PhongMaterial.tsのsetLightUniforms/setDirectionalLightUniforms/
    // setPointLightUniforms/setAmbientLightUniformをそのまま移植
}
```

`lightDirection`/`eyeDirection`/`ambientColor`のフィールドと対応する3つのsetter（`setLightDirection`/`setEyeDirection`/`setAmbientColor`）は削除する。

### `MaterialFactory.gouraudMaterial()`

`phongMaterial(shininess: number = 50.0): PhongMaterial`と同じ形に揃える。

```ts
static gouraudMaterial(shininess: number = 50.0): GouraudMaterial {
    if (!this.shaderLoader) {
        throw new Error('MaterialFac†ory not initialized. Call init!!');
    }

    const shader = this.shaderLoader.getShaderProgram('gouraudLighting');
    return new GouraudMaterial(shader, shininess);
}
```

`Color`/`Vector3`のimportはこの関数のためだけに存在しており、変更後は`MaterialFactory.ts`内の他の箇所でも使われていなければ不要になる（実装時に要確認）。

### `gouraudLighting.vert`

`phongLighting.frag`の構造体・uniform・ヘルパー関数を頂点シェーダ向けに適応させる。

```glsl
#version 300 es

layout(std140) uniform GlobalUniforms { // binding = 0 を削除
    mat4 viewMatrix;
    mat4 projectionMatrix;
    float time;
    vec2 resolution;
};

#define MAX_POINT_LIGHTS 8
#define MAX_DIRECTIONAL_LIGHTS 8

struct PointLight {
    vec3 position;
    vec4 color;
    float intensity;
};

struct DirectionalLight {
    vec3 direction;
    vec4 color;
    float intensity;
};

struct LightResult {
    vec3 diffuse;
    vec3 specular;
};

in vec3 aPosition;
in vec4 aColor;
in vec3 aNormal;

uniform mat4 modelMatrix;
uniform mat4 invMatrix;
uniform vec3 eyeDirection;
uniform float shininess;

uniform PointLight pointLights[MAX_POINT_LIGHTS];
uniform int pointLightCounts;
uniform DirectionalLight directionalLights[MAX_DIRECTIONAL_LIGHTS];
uniform int directionalLightCounts;
uniform vec4 ambientLightColor;

out vec4 vColor;

LightResult calculateLight(vec3 ld, vec3 lightColor, float intensity, vec3 normal){
    vec3 invLight = normalize(invMatrix * vec4(ld, 0.0)).xyz;
    vec3 invEye = normalize(invMatrix * vec4(eyeDirection, 0.0)).xyz;
    vec3 halfLEVec = normalize(invLight + invEye);
    float diffuse = clamp(dot(normal, invLight), 0.0, 1.0);
    float specular = pow(clamp(dot(normal, halfLEVec), 0.0, 1.0), shininess);
    vec3 radiance = lightColor * intensity;
    return LightResult(diffuse * radiance, specular * radiance);
}

LightResult calculateDirectionalLight(DirectionalLight light, vec3 normal){
    return calculateLight(light.direction, light.color.rgb, light.intensity, normal);
}

LightResult calculatePointLight(PointLight light, vec3 worldPosition, vec3 normal){
    return calculateLight(light.position - worldPosition, light.color.rgb, light.intensity, normal);
}

void main(void){
    vec3 worldPosition = (modelMatrix * vec4(aPosition, 1.0)).xyz;

    LightResult result = LightResult(vec3(0.0), vec3(0.0));
    int clampedDirectionalLightCounts = min(directionalLightCounts, MAX_DIRECTIONAL_LIGHTS);
    for(int i = 0; i < clampedDirectionalLightCounts; i++){
        LightResult calculatedParam = calculateDirectionalLight(directionalLights[i], aNormal);
        result.diffuse += calculatedParam.diffuse;
        result.specular += calculatedParam.specular;
    }

    int clampedPointLightCounts = min(pointLightCounts, MAX_POINT_LIGHTS);
    for(int i = 0; i < clampedPointLightCounts; i++){
        LightResult calculatedParam = calculatePointLight(pointLights[i], worldPosition, aNormal);
        result.diffuse += calculatedParam.diffuse;
        result.specular += calculatedParam.specular;
    }

    vColor = aColor * vec4(result.diffuse, 1.0) + vec4(result.specular, 1.0) + ambientLightColor;

    mat4 mvpMatrix = projectionMatrix * viewMatrix * modelMatrix;
    gl_Position = mvpMatrix * vec4(aPosition, 1.0);
}
```

`calculateLight`/`calculateDirectionalLight`/`calculatePointLight`という関数名・`LightResult`構造体・`main()`内のループ構造は`phongLighting.frag`とそろえてあるが、`normal`/`worldPosition`をフラグメント側の`vNormal`/`vPosition`のようなグローバル参照ではなく明示的な引数として渡す点だけが頂点シェーダ向けの適応（Context節「決定事項」参照）。uniform名は`ambientColor`から`ambientLightColor`へ変更する。

### `gouraudLighting.frag`

変更しない。現状の`outputColor = vColor;`というパススルーのまま維持する。

## 変更対象ファイル

- **書き換え**: `src/scene/material/GouraudMaterial.ts`（コンストラクタ・`setUniform()`・setter群を`PhongMaterial.ts`と同型に全面書き換え）
- **書き換え**: `src/scene/factory/MaterialFactory.ts`（`gouraudMaterial()`のシグネチャ変更、不要になった`Color`/`Vector3`のimport整理）
- **書き換え**: `src/webgl/shader/gouraudLighting.vert`（構造体・uniform・ヘルパー関数の追加、`main()`のライティング計算部分の全面書き換え）
- **スコープ外**: `src/webgl/shader/gouraudLighting.frag`（変更なし）
- **スコープ外**: `src/scene/renderer/RendererContext.ts`の`setLights()`（下記「前提となる既知の未接続」参照。今回の変更に含めない）

## 検証方法

- 型チェック（`GouraudMaterial.ts`/`MaterialFactory.ts`の変更後、`npx tsc --noEmit`または`npm run build`の型チェック部分）。
- シェーダーはユニットテスト化できないため、実機（ブラウザ）で`MaterialFactory.gouraudMaterial()`を使うシーンを描画して確認する。ただし下記「前提となる既知の未接続」が未解消の場合、ライティングが効いているかどうかの見た目の変化自体を確認できない可能性がある点に注意。

## 前提となる既知の未接続（今回のスコープ外）

`RendererContext.setLights()`の呼び出し元が現状プロジェクト内に存在しない（`.claude/rules/pipeline.md`に記載済みのサイレントな未接続）。`context.getLights()`は常に空配列を返すため、今回の修正で`GouraudMaterial`をPhongと同じ自己完結方式に揃えても、この配線が別途行われない限り実際の光源データはシェーダへ届かない。これは`PhongMaterial`も同様に抱えている前提条件であり、今回の変更で新たに生じる問題ではないが、実機確認時に「直したのに見た目が変わらない」という混乱を避けるため明記しておく。解消する場合は本ドキュメントとは別の設計判断（`LightNode`からどうシーン走査時に`RendererContext`へ光源を投入するか）が必要になる。

## 実装分担についての注意

`.claude/CLAUDE.md`の編集範囲制限により、`src/`配下（シェーダー含む）のコード編集は原則ユーザー自身が行う。本ドキュメントは会話内で確定した設計をユーザーが実装する際の実装メモとして書き出したものであり、Claude Codeによる直接のコード変更はこのドキュメント作成時点では行っていない。将来的にこの内容をそのままClaude Codeに反映させたい場合は、CLAUDE.mdが定める例外条件（新規の設計判断を伴わない機械的反映であることと、ユーザーの明示的な同意）を満たした上で`glspinner-implement`を使う。

## この提案の経緯

`glspinner-task-discovery`的な文脈で「グローシェーディングの実装がフォンシェーディングの実装に合わせて修正しなければならないが、まだ修正ができていない」という課題が挙がり、実際に`PhongMaterial.ts`/`phongLighting.frag`/`GouraudMaterial.ts`/`gouraudLighting.vert`/`gouraudLighting.frag`/`MaterialFactory.ts`/`RendererContext.ts`/`LightConstants.ts`を読み比べて差分を洗い出した。当初この内容を`glspinner-implement`で直接コードに反映しようとしたが、ユーザーから「まず`design/`配下にドキュメントとして残したい」という指示があり、実装は行わず本ドキュメントの作成に切り替えた。
