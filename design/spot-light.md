# Spotライトタイプの拡張

**ステータス**: 提案（未実装）
**対象**: `src/scene/light/LightConstants.ts`, `src/scene/core/node/SpotLightNode.ts`（新規）, `src/scene/material/LitMaterial.ts`, `src/webgl/shader/phongLighting.frag`, `src/webgl/shader/gouraudLighting.vert`

## Context（なぜこの変更をするか）

Notionタスク「⑤ Spotライトタイプの拡張」（`glspinner改良タスク`DB）に着手するための設計。前提タスク「Material/Mesh Uniform受け渡し方式の統一リファクタ」は完了済み（Notion側もStatus更新済み）。

現状のライティングは`LightType`（Directional/Point/Ambient）の3種で、以下の3層で構成されている:

- **シーングラフ側**: `LightNode`（抽象）→`DirectionalLightNode`/`PointLightNode`/`AmbientLightNode`（具象）
- **TypeScript側**: `LitMaterial`（`PhongMaterial`/`GouraudMaterial`の共通基底、`design/lit-material-extraction.md`参照）が`context.getLights()`から取得した`LightParams[]`を`LightType`ごとにフィルタしてUniformへ送る
- **シェーダー側**: `phongLighting.frag`（フラグメントごとに計算）/`gouraudLighting.vert`（頂点ごとに計算）という実体が2ファイルに分かれた場所

Spotライトはこの3層すべてに新しい種別を1つ追加する作業になる。

設計の過程で`Transform.ts`/`LightNode`系4ファイル（`LightNode.ts`, `PointLightNode.ts`, `DirectionalLightNode.ts`, `AmbientLightNode.ts`）を実際に読んで確認した結果、重要な事実が判明した:

**`Transform`には回転から前方ベクトルを計算する仕組みが一切存在しない**（`getRotation()`すら無く、`rotation`フィールドはsetterのみで外部から読めない）。さらに**既存の`DirectionalLightNode`もシーングラフ上の回転を無視し**、コンストラクタ引数で受け取った生の`Vector3`（デフォルト`(-0.5, 0.5, 0.5)`、正規化もされていない）をそのまま光源方向として保持している。シーングラフのTransformを実際に使っているのは`PointLightNode.getLightData()`の`this.transform.getWorldPosition()`だけ、という非対称が既にある。

## 決定事項（会話で合意済み）

| 論点 | 決定 |
|---|---|
| `SpotLightNode`の向き（direction）をどこから取得するか | コンストラクタ引数+setterで生の`Vector3`を保持する（`DirectionalLightNode`と同じ方式）。`Transform`の回転からの導出（`Transform.getRotation()`の新設＋回転→方向ベクトル変換ユーティリティの新設が必要になる、より大きなスコープの案）は却下——今回はTransform/math側への新規メソッド追加を一切行わない範囲に留める |
| `SpotLightNode`の位置（position）をどこから取得するか | `PointLightNode`と同じく`this.transform.getWorldPosition()` |
| Notionタスク文言「コーン角/減衰」の解釈 | コーン端でのなめらかな減衰（inner/outer cone角によるsmoothstep）のみを指すと解釈する。既存の`PointLightParams`が距離減衰（inverse-square falloff）を一切持たない（`calculatePointLight`は方向のみ正規化して使い、距離は捨てている）現状との整合を優先し、Spotだけに距離減衰を追加することはスコープに含めない |
| コーン角の単位・変換位置 | ラジアンの`number`として型・ノードで保持し、`cos()`変換はシェーダー側で行う（`shininess`等、既存コードがCPU側で前処理せず生の値のまま送っている流儀に倣う） |

## 設計

### 1. `src/scene/light/LightConstants.ts`

- `LightType`に`Spot: 4`を追加
- `MAX_SPOT_LIGHTS = 8`を追加（既存の`MAX_DIRECTIONAL_LIGHTS`/`MAX_POINT_LIGHTS`と同じ並び）
- `SpotLightParams`を`LightCommonParams`ベースの他の型と同型で追加:

```ts
export type SpotLightParams = LightCommonParams & {
    lightType: typeof LightType.Spot;
    position: Vector3;
    direction: Vector3;
    innerConeAngle: number; // ラジアン。この角度までは全光量
    outerConeAngle: number; // ラジアン。この角度でゼロまで減衰
};
```

- `LightParams`のUnion型に`SpotLightParams`を追加する

### 2. `src/scene/core/node/SpotLightNode.ts`（新規）

`DirectionalLightNode`（コンストラクタ引数+setterで生の値を保持）と`PointLightNode`（`transform.getWorldPosition()`）のパターンをそのまま組み合わせる:

```ts
export class SpotLightNode extends LightNode {
    private direction: Vector3;
    private innerConeAngle: number;
    private outerConeAngle: number;

    constructor(
        light: Light,
        direction: Vector3 = new Vector3(0, -1, 0),
        innerConeAngle: number = Math.PI / 8,
        outerConeAngle: number = Math.PI / 6
    ) {
        super(light);
        this.direction = direction;
        this.innerConeAngle = innerConeAngle;
        this.outerConeAngle = outerConeAngle;
    }

    setDirection(direction: Vector3): void { this.direction = direction; }
    setInnerConeAngle(angle: number): void { this.innerConeAngle = angle; }
    setOuterConeAngle(angle: number): void { this.outerConeAngle = angle; }

    public getLightData(): SpotLightParams {
        return {
            position: this.transform.getWorldPosition(),
            direction: this.direction,
            innerConeAngle: this.innerConeAngle,
            outerConeAngle: this.outerConeAngle,
            lightType: LightType.Spot,
            color: this.light.getColor(),
            intensity: this.light.getIntensity(),
        };
    }
}
```

`node.md`の既存パターン（`LightNode`抽象を継承し`getLightData()`だけ実装する）にそのまま乗る。新規の抽象化・Transform変更は不要。

### 3. `src/scene/material/LitMaterial.ts`

既存の`setDirectionalLightUniforms`/`setPointLightUniforms`/`setAmbientLightUniform`と並ぶ`setSpotLightUniforms`を追加し、`setLightUniforms()`から呼ぶ:

```ts
private setLightUniforms(gl, lights: LightParams[]): void {
    this.setDirectionalLightUniforms(gl, lights);
    this.setPointLightUniforms(gl, lights);
    this.setSpotLightUniforms(gl, lights);
    this.setAmbientLightUniform(gl, lights);
}

private setSpotLightUniforms(gl: WebGL2RenderingContext, lights: LightParams[]): void {
    const spotLights = lights.filter((light) => light.lightType === LightType.Spot);
    if (spotLights.length === 0) return;

    this.shaderProgram.setUniform(gl, 'spotLightCounts', new ShaderUniformValue(spotLights.length, 'int'));
    for (let i = 0; i < spotLights.length; i++) {
        const light = spotLights[i];
        const commonUniformStr = `spotLights[${i}]`;
        this.shaderProgram.setUniform(gl, commonUniformStr + '.position', new ShaderUniformValue(light.position));
        this.shaderProgram.setUniform(gl, commonUniformStr + '.direction', new ShaderUniformValue(light.direction));
        this.shaderProgram.setUniform(gl, commonUniformStr + '.innerConeAngle', new ShaderUniformValue(light.innerConeAngle));
        this.shaderProgram.setUniform(gl, commonUniformStr + '.outerConeAngle', new ShaderUniformValue(light.outerConeAngle));
        this.shaderProgram.setUniform(gl, commonUniformStr + '.color', new ShaderUniformValue(light.color.toVector4()));
        this.shaderProgram.setUniform(gl, commonUniformStr + '.intensity', new ShaderUniformValue(light.intensity));
    }
}
```

`setDirectionalLightUniforms`/`setPointLightUniforms`と完全に対称な構造。`PhongMaterial`/`GouraudMaterial`双方がこの`LitMaterial`を継承しているため、両シェーダーとも自動的にこのUniform配線を受け取る。

### 4. シェーダー側: `phongLighting.frag`と`gouraudLighting.vert`の両方に追加

`~Material`ファミリーのTS側は`LitMaterial`に一本化されたが、GLSLの実体は計算タイミングが異なる2ファイルのままなので、両方に同じ`struct`・ヘルパー関数・ループを追加する必要がある。これはDirectional/Pointが既にこの2ファイルへの重複という形で存在している既存パターンをそのまま踏襲するだけで、新しい重複を持ち込むわけではない（`shader.md`が記録している「GLSLファイル間の重複は設計判断が絡むため軽々に一括修正すべきでない」という記述と矛盾しない）。

共通の追加内容（`calculateLight`は既存のヘルパーをそのまま再利用し、コーン減衰だけ追加で掛ける）:

```glsl
#define MAX_SPOT_LIGHTS 8

struct SpotLight {
    vec3 position;
    vec3 direction;
    float innerConeAngle;
    float outerConeAngle;
    vec4 color;
    float intensity;
};

uniform SpotLight spotLights[MAX_SPOT_LIGHTS];
uniform int spotLightCounts;
```

`phongLighting.frag`（`vNormal`/`vPosition`をグローバル参照する既存の`frag`側の流儀に合わせる）:

```glsl
LightResult calculateSpotLight(SpotLight light){
    vec3 toLight = light.position - vPosition;
    LightResult result = calculateLight(toLight, light.color.rgb, light.intensity);

    vec3 lightToFrag = normalize(-toLight);
    float cosAngle = dot(lightToFrag, normalize(light.direction));
    float epsilon = cos(light.innerConeAngle) - cos(light.outerConeAngle);
    float coneAttenuation = clamp((cosAngle - cos(light.outerConeAngle)) / epsilon, 0.0, 1.0);

    result.diffuse *= coneAttenuation;
    result.specular *= coneAttenuation;
    return result;
}
```

`gouraudLighting.vert`（`normal`/`worldPosition`を明示引数で渡す既存の`vert`側の流儀に合わせる。この明示引数化は`design/gouraud-phong-alignment.md`で決めた既存の設計方針をそのまま踏襲する）:

```glsl
LightResult calculateSpotLight(SpotLight light, vec3 worldPosition, vec3 normal){
    vec3 toLight = light.position - worldPosition;
    LightResult result = calculateLight(toLight, light.color.rgb, light.intensity, normal);

    vec3 lightToFrag = normalize(-toLight);
    float cosAngle = dot(lightToFrag, normalize(light.direction));
    float epsilon = cos(light.innerConeAngle) - cos(light.outerConeAngle);
    float coneAttenuation = clamp((cosAngle - cos(light.outerConeAngle)) / epsilon, 0.0, 1.0);

    result.diffuse *= coneAttenuation;
    result.specular *= coneAttenuation;
    return result;
}
```

両ファイルの`main()`に、既存のPoint Lightループの直後へ同型のSpot Lightループを追加する:

```glsl
int clampedSpotLightCounts = min(spotLightCounts, MAX_SPOT_LIGHTS);
for(int i = 0; i < clampedSpotLightCounts; i++){
    LightResult calculatedParam = calculateSpotLight(spotLights[i] /*, worldPosition, aNormal（vertのみ）*/);
    result.diffuse += calculatedParam.diffuse;
    result.specular += calculatedParam.specular;
}
```

## 変更対象ファイル

- **書き換え**: `src/scene/light/LightConstants.ts`（`LightType.Spot`・`MAX_SPOT_LIGHTS`・`SpotLightParams`・`LightParams`Union更新）
- **新規**: `src/scene/core/node/SpotLightNode.ts`
- **書き換え**: `src/scene/material/LitMaterial.ts`（`setSpotLightUniforms`追加）
- **書き換え**: `src/webgl/shader/phongLighting.frag`（`SpotLight`struct・`calculateSpotLight`・ループ追加）
- **書き換え**: `src/webgl/shader/gouraudLighting.vert`（同上、vert向けシグネチャで追加）
- **スコープ外**: `src/tools/gui/LightGuiController.ts`等GUI側の対応（Notion記載にも無い）。なお`LightGuiController`は`design/lit-material-extraction.md`の作業で既に孤立コードの疑いが指摘されている
- **スコープ外**: `Transform.getRotation()`・回転→方向ベクトル変換ユーティリティの新設（将来、シーングラフの回転にライト方向を連動させたくなった場合の別途の設計課題）

## 検証方法

- `npx tsc --noEmit`（または`npm run build`の型チェック部分）で型エラーが無いこと。
- `npm run lint`。
- 実機（`npm run dev`）で`SpotLightNode`を配置し、`PhongMaterial`/`GouraudMaterial`双方でコーンの内外に応じて明るさが滑らかに変化することを確認する（`innerConeAngle`/`outerConeAngle`をコードで変えてコーンの見た目が変わることも確認）。

## 実装分担についての注意

`.claude/CLAUDE.md`の編集範囲制限により、`src/`配下（シェーダー含む）の実際のコード変更は原則ユーザー自身が行う。本設計は「Directional/Pointの既存パターンをほぼそのまま新種別に適用するだけ」であり新規のアーキテクチャ判断は伴わないため、CLAUDE.mdが定める機械的反映の例外条件（新規の設計判断を伴わない・ユーザーの明示同意）を満たせば、ユーザーが直接同意した場合に限りClaude Codeが代行することもできる。

実装完了後は、`.claude/rules/node.md`（`LightNode`具象クラス一覧への追加）・`.claude/rules/material.md`（`LitMaterial`のライト種別一覧）・`.claude/rules/shader.md`（`phongLighting.frag`/`gouraudLighting.vert`の変更点）への反映を`glspinner-conventions`に、`docs/`配下のスナップショット更新を別途検討する。あわせてNotionタスク「⑤ Spotライトタイプの拡張」のStatus更新も行う。

## この提案の経緯

Notionタスク「⑤ Spotライトタイプの拡張」の記載（`LightType`への`Spot`追加、`SpotLightParams`新設、`SpotLightNode`追加、シェーダー側のコーン減衰計算追加）を出発点に、`glspinner-design`スキルでプランモードに入り検討した。既存の`LightNode`系4ファイルと`Transform.ts`を実際に読んだ結果、`Transform`に回転→方向ベクトル変換の仕組みが一切無く、既存の`DirectionalLightNode`自体もシーングラフの回転を使わず生のベクトルを保持する設計になっているという事実が判明。この非対称を踏まえ、SpotLightNodeの方向取得方法（Transformから新規に導出する本格対応か、既存パターンの組み合わせで済ませるか）をユーザーに確認し、後者（既存パターンの組み合わせ、Transform/math側の変更なし）で合意した。あわせてNotion記載の「減衰」の解釈（コーン端減衰のみか、距離減衰も含むか）も、既存の`PointLightParams`に距離減衰が無い現状との整合を優先してコーン端減衰のみとする方針で合意した。
