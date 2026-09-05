# Spotライトタイプの拡張

**ステータス**: 提案（未実装）
**対象**: `src/scene/transform/Transform.ts`, `src/scene/light/LightConstants.ts`, `src/scene/core/node/SpotLightNode.ts`（新規）, `src/scene/material/LitMaterial.ts`, `src/webgl/shader/phongLighting.frag`, `src/webgl/shader/gouraudLighting.vert`

## Context（なぜこの変更をするか）

Notionタスク「⑤ Spotライトタイプの拡張」（`glspinner改良タスク`DB）に着手するための設計。前提タスク「Material/Mesh Uniform受け渡し方式の統一リファクタ」は完了済み（Notion側もStatus更新済み）。

現状のライティングは`LightType`（Directional/Point/Ambient）の3種で、以下の3層で構成されている:

- **シーングラフ側**: `LightNode`（抽象）→`DirectionalLightNode`/`PointLightNode`/`AmbientLightNode`（具象）
- **TypeScript側**: `LitMaterial`（`PhongMaterial`/`GouraudMaterial`の共通基底、`design/lit-material-extraction.md`参照）が`context.getLights()`から取得した`LightParams[]`を`LightType`ごとにフィルタしてUniformへ送る
- **シェーダー側**: `phongLighting.frag`（フラグメントごとに計算）/`gouraudLighting.vert`（頂点ごとに計算）という実体が2ファイルに分かれた場所

Spotライトはこの3層すべてに新しい種別を1つ追加する作業になる。

設計の過程で`Transform.ts`/`LightNode`系4ファイル（`LightNode.ts`, `PointLightNode.ts`, `DirectionalLightNode.ts`, `AmbientLightNode.ts`）を実際に読んで確認した結果、重要な事実が判明した:

**`Transform`には回転から前方ベクトルを計算する仕組みが一切存在しない**（`getRotation()`すら無く、`rotation`フィールドはsetterのみで外部から読めない）。さらに**既存の`DirectionalLightNode`もシーングラフ上の回転を無視し**、コンストラクタ引数で受け取った生の`Vector3`（デフォルト`(-0.5, 0.5, 0.5)`、正規化もされていない）をそのまま光源方向として保持している。シーングラフのTransformを実際に使っているのは`PointLightNode.getLightData()`の`this.transform.getWorldPosition()`だけ、という非対称が既にある。

**この非対称を踏まえていったんは「既存パターンの組み合わせ（Transform/math側は一切変更しない）」で合意したが、実装に着手する過程で再検討し、方針を変更した。** 理由: `SpotLightNode`は位置・向きの両方が同時に意味を持つ初めてのライトであり、`position`が`transform.getWorldPosition()`（回転を含む親子階層を反映する）である一方`direction`が回転と無関係な固定値のままだと、回転する親ノードにぶら下げた場合に「位置は追従するのに向きだけ置き去りになる」という直感に反する挙動が生じる。3Dエンジン一般（Three.js/Unity/Unreal等）でもスポットライトの向きはTransformの回転から導出するのが標準であり、位置と向きが同じ1つの情報源（Transform）から出てくる方が本来あるべき姿と判断した。`glspinner`という名前からしても「回転するオブジェクト」は今後の主要なユースケースになりうるため、回転に追従するライトを作れることには実用的な価値がある。

## 決定事項（会話で合意済み）

| 論点 | 決定 |
|---|---|
| `SpotLightNode`の向き（direction）をどこから取得するか | **（改訂）** `Transform`の回転から導出する。`Transform`に`getRotation()`（既存の`rotation`フィールドのgetter）と`getForwardVector()`（回転を基準前方向`(0, 0, -1)`へ適用して正規化する、新設の派生プロパティ）を追加し、`SpotLightNode.getLightData()`は`this.transform.getForwardVector()`を使う。コンストラクタ引数+setterで生のVector3を保持する案（`DirectionalLightNode`と同じ方式）は、位置は追従するのに向きは追従しないという非対称が生む違和感を理由に却下した |
| `SpotLightNode`の位置（position）をどこから取得するか | `PointLightNode`と同じく`this.transform.getWorldPosition()`。向きと同じ`Transform`が情報源になるため、位置・向きとも単一のTransformから一貫して導出される |
| Notionタスク文言「コーン角/減衰」の解釈 | コーン端でのなめらかな減衰（inner/outer cone角によるsmoothstep）のみを指すと解釈する。既存の`PointLightParams`が距離減衰（inverse-square falloff）を一切持たない（`calculatePointLight`は方向のみ正規化して使い、距離は捨てている）現状との整合を優先し、Spotだけに距離減衰を追加することはスコープに含めない |
| コーン角の単位・変換位置 | ラジアンの`number`として型・ノードで保持し、`cos()`変換はシェーダー側で行う（`shininess`等、既存コードがCPU側で前処理せず生の値のまま送っている流儀に倣う） |
| 基準前方向`(0, 0, -1)`を定数化するか | **（追加）** する。`src/math/vector/VectorConstants.ts`の`DefaultVectorConstants`（既存の`AXIS2DX`/`AXIS2DY`/`AXIS2DZ`が置かれている場所）に`FORWARD`を追加し、`Transform.getForwardVector()`から参照する。`Camera.ts:35`の`this.forward`デフォルト値も同じ値を独立に持っており、定数化しないと「同じ意味の値が2箇所に生で書かれる」状態になるため |

### 補足: `Camera.ts`側もこの定数を参照するかは別途の判断

`Camera.up`のデフォルト値（`Camera.ts:34`、`new Vector3(0.0, 1.0, 0.0)`）も同種の状況だが、今回`Transform`側では使わない値のため、`FORWARD`のように「2箇所で重複している」わけではなく今回のスコープには含めない（`UP`定数の追加は任意の発展）。`Camera.ts:35`の`this.forward`デフォルト値を新しい`FORWARD`定数へ差し替えるかどうかは、値そのものは変わらない安全な変更ではあるが、`Camera.ts`という既存の稼働中コードへの変更が1ファイル増えることになるため、実装時にユーザーが判断する（`VectorConstants.ts`への追加自体、および`Transform.getForwardVector()`からの参照は今回の設計に含める）。

## 設計

### 0a. `src/math/vector/VectorConstants.ts`（改訂で追加）

既存の`DefaultVectorConstants`（`AXIS2DX`/`AXIS2DY`/`AXIS2DZ`が置かれている場所）に`FORWARD`を追加する:

```ts
export const DefaultVectorConstants = {
    AXIS2DX: new Vector3(1, 0, 0),
    AXIS2DY: new Vector3(0, 1, 0),
    AXIS2DZ: new Vector3(0, 0, 1),
    FORWARD: new Vector3(0.0, 0.0, -1.0), // 追加。Camera.tsのthis.forwardデフォルト値と同じ規約
    // ...
};
```

### 0b. `src/scene/transform/Transform.ts`（改訂で追加）

`rotation`フィールド（現状private・setterのみ）を読み出す`getRotation()`と、そこから前方ベクトルを導出する`getForwardVector()`を追加する。既存の`getWorldPosition()`（`worldMatrix`から派生値を計算して返すgetter）と同種の「Transformの内部状態から派生プロパティを計算して返す」パターンに素直に乗る。

```ts
public getRotation(): Quaternion {
    return this.rotation;
}

public getForwardVector(): Vector3 {
    return VectorCalculator.normalize(QuaternionCalculator.rotateVector(this.rotation, DefaultVectorConstants.FORWARD));
}
```

ビルディングブロックは既存の`QuaternionCalculator.rotateVector(q, v)`（`q * v * q⁻¹`を計算するが正規化はしない）と`VectorCalculator.normalize<T extends Vector<T>>(vector: T): T`（実在確認済み）。

**`Camera`との整合を確認済み**: `Camera.ts`を実際に読んだところ、コンストラクタで`this.forward = direction.forward ?? new Vector3(0.0, 0.0, -1.0);`と基準前方向を`(0, 0, -1)`にしており、`calculateViewMatrix()`内で`const calcForward = QuaternionCalculator.rotateVector(this.rotation, this.forward);`と、まさに同じ`QuaternionCalculator.rotateVector()`を同じ基準ベクトルに適用している。つまり「基準前方向`(0,0,-1)`＋`QuaternionCalculator.rotateVector()`で回転適用」は`Camera`が既に使っている確立済みの規約であり、`Transform.getForwardVector()`をこれに合わせることで両者の向きの意味が一致する。唯一の違いは、`Camera`側は`calcForward`を正規化せず`MatrixCalculator.lookAt()`（内部で`VectorCalculator.normalize()`する）に渡している点——`Transform.getForwardVector()`は呼び出し側（`SpotLightNode`等）へ完成品のベクトルを返す必要があるため、明示的に`VectorCalculator.normalize()`を呼ぶ設計のままでよい。なお`Camera.ts:35`自体は今回`DefaultVectorConstants.FORWARD`へ差し替えず、独自の`new Vector3(0.0, 0.0, -1.0)`リテラルのまま残す想定（上記「補足」参照。差し替えるかは別途の判断）。

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

**（改訂）** `direction`フィールド・`setDirection()`は持たない。位置と向きの両方を`this.transform`から導出する——これは`PointLightNode`が既にやっている「`transform.getWorldPosition()`を毎回`getLightData()`内で読む」パターンを、向きにもそのまま広げただけになる。

```ts
export class SpotLightNode extends LightNode {
    private innerConeAngle: number;
    private outerConeAngle: number;

    constructor(
        light: Light,
        innerConeAngle: number = Math.PI / 8,
        outerConeAngle: number = Math.PI / 6
    ) {
        super(light);
        this.innerConeAngle = innerConeAngle;
        this.outerConeAngle = outerConeAngle;
    }

    setInnerConeAngle(angle: number): void { this.innerConeAngle = angle; }
    setOuterConeAngle(angle: number): void { this.outerConeAngle = angle; }

    public getLightData(): SpotLightParams {
        return {
            position: this.transform.getWorldPosition(),
            direction: this.transform.getForwardVector(),
            innerConeAngle: this.innerConeAngle,
            outerConeAngle: this.outerConeAngle,
            lightType: LightType.Spot,
            color: this.light.getColor(),
            intensity: this.light.getIntensity(),
        };
    }
}
```

`node.md`の既存パターン（`LightNode`抽象を継承し`getLightData()`だけ実装する）にそのまま乗る。位置と同様、向きも「値を保持するのではなく毎回`this.transform`から読む」構造になったことで、`PointLightNode`との対称性がむしろ改訂前より高まっている。

**利用側の操作方法**: `SceneNode`が元から持つ`getTransform().setPosition(...)`/`getTransform().setRotation(...)`で配置・向きを変える、という他の`~Node`と全く同じ操作感になる（`spotLightNode.setDirection(...)`のような専用APIは無くなる）。既存の`setRotation(quaternion: Quaternion)`はクォータニオンを直接組み立てる必要がありDirectionalLightNodeの旧`setDirection(vector: Vector3)`ほど手軽ではない点は残るトレードオフ——必要になれば`SpotLightNode.lookAt(target: Vector3)`のような補助メソッドを別途追加することで緩和できるが、今回のスコープには含めない。

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

- **書き換え**: `src/math/vector/VectorConstants.ts`（`DefaultVectorConstants.FORWARD`追加）
- **書き換え**: `src/scene/transform/Transform.ts`（`getRotation()`・`getForwardVector()`追加）
- **書き換え**: `src/scene/light/LightConstants.ts`（`LightType.Spot`・`MAX_SPOT_LIGHTS`・`SpotLightParams`・`LightParams`Union更新）
- **新規**: `src/scene/core/node/SpotLightNode.ts`
- **書き換え**: `src/scene/material/LitMaterial.ts`（`setSpotLightUniforms`追加）
- **書き換え**: `src/webgl/shader/phongLighting.frag`（`SpotLight`struct・`calculateSpotLight`・ループ追加）
- **書き換え**: `src/webgl/shader/gouraudLighting.vert`（同上、vert向けシグネチャで追加）
- **スコープ外**: `src/tools/gui/LightGuiController.ts`等GUI側の対応（Notion記載にも無い）。なお`LightGuiController`は`design/lit-material-extraction.md`の作業で既に孤立コードの疑いが指摘されている
- **スコープ外**: `SpotLightNode.lookAt(target)`のような向き設定の補助メソッド（必要になれば別途検討）
- **任意・スコープ外**: `src/scene/camera/Camera.ts:35`の`this.forward`デフォルト値を`DefaultVectorConstants.FORWARD`へ差し替えること（値は変わらないが既存稼働中コードへの変更が1件増えるため、実装時にユーザーが判断）

## 検証方法

- `npx tsc --noEmit`（または`npm run build`の型チェック部分）で型エラーが無いこと。
- `npm run lint`。
- 実機（`npm run dev`）で`SpotLightNode`を配置し、`PhongMaterial`/`GouraudMaterial`双方でコーンの内外に応じて明るさが滑らかに変化することを確認する（`innerConeAngle`/`outerConeAngle`をコードで変えてコーンの見た目が変わることも確認）。
- `spotLightNode.getTransform().setRotation(...)`で回転を変えたとき、コーンの向きが期待通りに変わることを確認する（基準前方向の規約自体は`Camera.ts`との突き合わせでコードレベルでは確認済み。ここでは実際の見た目でも直感通りかを最終確認する）。

## 実装分担についての注意

`.claude/CLAUDE.md`の編集範囲制限により、`src/`配下（シェーダー含む）の実際のコード変更は原則ユーザー自身が行う。`LightConstants.ts`/`SpotLightNode.ts`/`LitMaterial.ts`/シェーダー2ファイルへの変更は「Directional/Pointの既存パターンをほぼそのまま新種別に適用するだけ」で新規のアーキテクチャ判断を伴わない。`Transform.ts`への`getRotation()`/`getForwardVector()`追加は全`SceneNode`が共有する基盤クラスへの変更で単なる新種別追加より一段慎重に扱うべき部分だったが、基準前方向`(0,0,-1)`＋`QuaternionCalculator.rotateVector()`という規約が`Camera.ts`で実際に使われているのと同一であることをコードレベルで確認済みのため、この点に関する新規の設計判断は残っていない。CLAUDE.mdが定める機械的反映の例外条件（新規の設計判断を伴わない・ユーザーの明示同意）を満たせば、ユーザーが直接同意した場合に限りClaude Codeが代行することもできる。

実装完了後は、`.claude/rules/node.md`（`LightNode`具象クラス一覧への追加）・`.claude/rules/material.md`（`LitMaterial`のライト種別一覧）・`.claude/rules/shader.md`（`phongLighting.frag`/`gouraudLighting.vert`の変更点）への反映を`glspinner-conventions`に、`docs/`配下のスナップショット更新を別途検討する。あわせてNotionタスク「⑤ Spotライトタイプの拡張」のStatus更新も行う。

## この提案の経緯

Notionタスク「⑤ Spotライトタイプの拡張」の記載（`LightType`への`Spot`追加、`SpotLightParams`新設、`SpotLightNode`追加、シェーダー側のコーン減衰計算追加）を出発点に、`glspinner-design`スキルでプランモードに入り検討した。既存の`LightNode`系4ファイルと`Transform.ts`を実際に読んだ結果、`Transform`に回転→方向ベクトル変換の仕組みが一切無く、既存の`DirectionalLightNode`自体もシーングラフの回転を使わず生のベクトルを保持する設計になっているという事実が判明。この非対称を踏まえ、SpotLightNodeの方向取得方法（Transformから新規に導出する本格対応か、既存パターンの組み合わせで済ませるか）をユーザーに確認し、当初は後者（既存パターンの組み合わせ、Transform/math側の変更なし）で合意した。あわせてNotion記載の「減衰」の解釈（コーン端減衰のみか、距離減衰も含むか）も、既存の`PointLightParams`に距離減衰が無い現状との整合を優先してコーン端減衰のみとする方針で合意した。

## 変更履歴

- 実装着手後、ユーザーから「物体の回転角度でライトの向きを決める方が直感的では」という再検討の提起があった。位置(`position`)は`transform.getWorldPosition()`で回転を含む親子階層に追従するのに、向き(`direction`)だけ回転と無関係な固定値のままだと、回転する親にぶら下げたときに位置だけ追従し向きが置き去りになるという指摘は妥当と判断し、方向取得方法の決定を「既存パターンの組み合わせ」から「`Transform`の回転から導出する」方針へ変更した。これに伴い`Transform.ts`への`getRotation()`/`getForwardVector()`追加が新たにスコープに入り、`SpotLightNode`から`direction`フィールド・`setDirection()`を削除して`this.transform.getForwardVector()`を直接使う形に設計を改めた（「Context」「決定事項」「設計0/2」「変更対象ファイル」「実装分担についての注意」の各節を本改訂に合わせて更新）。
- `Transform.getForwardVector()`の基準前方向`(0, 0, -1)`について、`Camera.ts`を実際に読んで同じ値・同じ`QuaternionCalculator.rotateVector()`の使い方をしていることを確認済みとした後、ユーザーから「`Camera`と`Transform`で同じ値を独立に持つなら定数化すべきでは」という指摘があった。妥当と判断し、`src/math/vector/VectorConstants.ts`の`DefaultVectorConstants`（既存の`AXIS2DX`/`AXIS2DY`/`AXIS2DZ`と同じ場所）に`FORWARD`を追加し`Transform.getForwardVector()`から参照する設計に変更した（「決定事項」に行追加、「設計0a/0b」に分割、「変更対象ファイル」に`VectorConstants.ts`追加）。`Camera.ts:35`側を新定数へ差し替えるかどうかは、既存稼働中コードへの追加変更になるため今回は任意・別判断のスコープ外とした。
