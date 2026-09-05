# PhongMaterial/GouraudMaterialの共通ロジックをLitMaterialへ抽出する

**ステータス**: 実装済み（2026-09-05、ユーザー自身が本提案どおりに実装。`npx tsc --noEmit`/`npm run lint`で確認済み。`.claude/rules/material.md`への反映は別途未実施）
**対象**: `src/scene/material/PhongMaterial.ts`, `src/scene/material/GouraudMaterial.ts`, `src/scene/material/LitMaterial.ts`（新規）, `src/scene/factory/MaterialFactory.ts`, `src/index.ts`

## Context（なぜこの変更をするか）

`design/gouraud-phong-alignment.md`の提案に沿って、ユーザー自身が`GouraudMaterial.ts`/`MaterialFactory.ts`/`gouraudLighting.vert`を実装済み。結果として`GouraudMaterial.ts`は`PhongMaterial.ts`と**クラス名以外バイト単位で完全に同一**になった:

- `shininess: number`フィールド
- `context.getCamera().calculateEyeDirection()`/`context.getLights()`から自己完結して値を取得する`setUniform()`
- `setShininess()`
- `setLightUniforms`/`setDirectionalLightUniforms`/`setPointLightUniforms`/`setAmbientLightUniform`の4つのprivateメソッド（`LightType`でDirectional/Point/Ambientをフィルタし、それぞれ配列uniform・合算値として送る）

シェーダー側（`gouraudLighting.vert`＝頂点ごとに反射モデルを計算／`phongLighting.frag`＝フラグメントごとに計算）は計算タイミングが本質的に異なるため区別を保つべきだが、TypeScript側のMaterialラッパーはもはや完全な重複コードでしかない。

`.claude/rules/material.md`は2026-07リファクタ時点で「`GouraudMaterial`のライト値取得方法（コンストラクタ引数+setter）が`PhongMaterial`（自己取得）と揃っていない点は意図的な保留」と記録していたが、この保留が解消され両クラスの実装が一致した今、残っているのは維持すべき差異のない単純な重複であり、揺れとして記録するのではなく解消すべき対象になった。

実際にコード・参照箇所を確認した結果:

- `PhongMaterial`/`GouraudMaterial`を参照するのは`src/`内では`MaterialFactory.ts`のみ（`instanceof`判定やダウンキャストは存在しない）。
- `MaterialFactory.ts`には`Color`/`Vector3`の不要なimportが残っている（`gouraudMaterial()`の旧シグネチャ（`lightDirection`/`eyeDirection`/`ambientColor`引数）の残骸）。
- `.claude/rules/material.md`・`docs/scene/material.md`・`docs/scene/factory.md`・`docs/tools/tools.md`・`docs/README.md`・`design/README.md`のGouraud関連記述が実装より古い状態のまま残っている（本ドキュメントのスコープ外。別途`glspinner-document`/`glspinner-conventions`での更新が必要）。

## 決定事項（会話で合意済み）

| 論点 | 決定 |
|---|---|
| PhongMaterial/GouraudMaterialという型としての区別を残すか | 残す。ユーザーの要望どおり、`instanceof`や名前としての意味は保つ |
| 重複したTSロジック（`shininess`・`setUniform()`・4つのライトuniformメソッド）をどうするか | `BaseMaterial`と両クラスの間に新しい中間抽象クラス`LitMaterial`を導入し、そこへ移す |
| `PhongMaterial`/`GouraudMaterial`を廃止して`LitMaterial`を直接使う案 | 却下。型としての区別を残したいという要望に反するため |
| 現状の完全重複を「意図的な重複」として`material.md`に記録するに留める案 | 却下。シェーダー側と違いTS側の重複には維持すべき差異が一切なく、単なる技術的負債であるため |
| 中間抽象クラスの命名 | `LitMaterial`。`Base`は`BaseMaterial`が既に使っているため再利用しない（`~Application`ファミリーの2段目`RecordingApplication`と同じ、追加する機能で命名する流儀）。同じ`~Material`ファミリーに既にある`UnlitMaterial`（ライティングなし）と対になる名前で、「ライティングを受けるMaterialの基底」という意味が一目で伝わる |
| `PhongMaterial`/`GouraudMaterial`のコンストラクタを再宣言するか | しない。`LitMaterial`のコンストラクタをそのまま継承させる（TypeScriptで合法かつ最も簡潔。両クラスは中身ゼロ行の空クラスになる） |

## 設計

### 新規: `src/scene/material/LitMaterial.ts`

`PhongMaterial.ts`/`GouraudMaterial.ts`の現在の中身（import・`shininess`フィールド・`setUniform()`・`setShininess()`・4つのprivateメソッド）をそのまま`abstract class LitMaterial extends BaseMaterial`へ移動する。ロジックはコピーではなく移動——中身は一切変えない。

```ts
import { Vector4 } from '../../math/vector/Vector4';
import { ShaderProgram } from '../../webgl/gl/ShaderProgram';
import { ShaderUniformValue } from '../../webgl/gl/uniform/ShaderUniformValue';
import { LightParams, LightType } from '../light/LightConstants';
import { RendererContext } from '../renderer/RendererContext';
import { Transform } from '../transform/Transform';
import { BaseMaterial } from './BaseMaterial';

export abstract class LitMaterial extends BaseMaterial {
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

        const lights = context.getLights();
        this.setLightUniforms(gl, lights);
    }

    setShininess(shininess: number): void {
        this.shininess = shininess;
    }

    private setLightUniforms(gl: WebGL2RenderingContext, lights: LightParams[]): void {
        this.setDirectionalLightUniforms(gl, lights);
        this.setPointLightUniforms(gl, lights);
        this.setAmbientLightUniform(gl, lights);
    }

    private setDirectionalLightUniforms(gl: WebGL2RenderingContext, lights: LightParams[]): void {
        const directionalLights = lights.filter((light) => light.lightType === LightType.Directional);
        if (directionalLights.length === 0) return;

        this.shaderProgram.setUniform(gl, 'directionalLightCounts', new ShaderUniformValue(directionalLights.length, 'int'));
        for (let i = 0; i < directionalLights.length; i++) {
            const light = directionalLights[i];
            const commonUniformStr = `directionalLights[${i}]`;
            this.shaderProgram.setUniform(gl, commonUniformStr + `.direction`, new ShaderUniformValue(light.direction));
            this.shaderProgram.setUniform(gl, commonUniformStr + '.color', new ShaderUniformValue(light.color.toVector4()));
            this.shaderProgram.setUniform(gl, commonUniformStr + '.intensity', new ShaderUniformValue(light.intensity));
        }
    }

    private setPointLightUniforms(gl: WebGL2RenderingContext, lights: LightParams[]): void {
        const pointLights = lights.filter((light) => light.lightType === LightType.Point);
        if (pointLights.length === 0) return;

        this.shaderProgram.setUniform(gl, 'pointLightCounts', new ShaderUniformValue(pointLights.length, 'int'));
        for (let i = 0; i < pointLights.length; i++) {
            const light = pointLights[i];
            const commonUniformStr = `pointLights[${i}]`;
            this.shaderProgram.setUniform(gl, commonUniformStr + `.position`, new ShaderUniformValue(light.position));
            this.shaderProgram.setUniform(gl, commonUniformStr + '.color', new ShaderUniformValue(light.color.toVector4()));
            this.shaderProgram.setUniform(gl, commonUniformStr + '.intensity', new ShaderUniformValue(light.intensity));
        }
    }

    private setAmbientLightUniform(gl: WebGL2RenderingContext, lights: LightParams[]): void {
        const ambientLights = lights.filter((light) => light.lightType === LightType.Ambient);
        if (ambientLights.length === 0) return;

        const calculatedAmbientColor = new Vector4(0, 0, 0, 0);
        for (const light of ambientLights) {
            calculatedAmbientColor.add(light.color.toVector4().multiply(light.intensity), calculatedAmbientColor);
        }

        this.shaderProgram.setUniform(gl, 'ambientLightColor', new ShaderUniformValue(calculatedAmbientColor));
    }
}
```

### `PhongMaterial.ts`/`GouraudMaterial.ts`を空クラスに縮小

```ts
// PhongMaterial.ts
import { ShaderProgram } from '../../webgl/gl/ShaderProgram';
import { LitMaterial } from './LitMaterial';

export class PhongMaterial extends LitMaterial {}
```

```ts
// GouraudMaterial.ts
import { ShaderProgram } from '../../webgl/gl/ShaderProgram';
import { LitMaterial } from './LitMaterial';

export class GouraudMaterial extends LitMaterial {}
```

これで両クラスは「型として区別されているが中身はゼロ行」という状態になり、「シェーダーが異なる以上型の区別は残す・重複はゼロにする」という要望を過不足なく満たす。将来Phong/Gouraudのどちらかだけに固有パラメータが増えた場合は、そのクラスにフィールド・メソッドを足すだけでよく、`LitMaterial`側には影響しない。

### `MaterialFactory.ts`

`phongMaterial()`/`gouraudMaterial()`の実装（`new PhongMaterial(shader, shininess)`/`new GouraudMaterial(shader, shininess)`、返り値の型注釈）はそのまま変更不要——`LitMaterial`化してもコンストラクタのシグネチャは変わらないため。ついでに未使用になっている`Color`/`Vector3`のimportを削除する（今回のリファクタで見つかった副産物のクリーンアップ）。

### `src/index.ts`

`BaseMaterial`が現状exportされているかを確認し、されていれば同じ扱いで`export * from './scene/material/LitMaterial';`を追加する（`PhongMaterial`/`GouraudMaterial`は既にexport済み・変更不要）。

## 変更対象ファイル

- **新規**: `src/scene/material/LitMaterial.ts`
- **書き換え（縮小）**: `src/scene/material/PhongMaterial.ts`, `src/scene/material/GouraudMaterial.ts`（空クラス化）
- **書き換え（import整理のみ）**: `src/scene/factory/MaterialFactory.ts`（`Color`/`Vector3`の不要import削除。`phongMaterial()`/`gouraudMaterial()`本体は変更不要）
- **書き換え（要確認）**: `src/index.ts`（`BaseMaterial`のexport状況に応じて`LitMaterial`のexportを追加）
- **スコープ外**: `.claude/rules/material.md`・`docs/scene/material.md`ほか、既に実装とずれている既存ドキュメント群の更新（別タスク。`glspinner-document`/`glspinner-conventions`が担当）

## 検証方法

- `npx tsc --noEmit`（または`npm run build`の型チェック部分）で`LitMaterial`抽出後も型エラーが出ないこと。
- `npm run lint`で未使用import（`Color`/`Vector3`）の警告が解消されていること。
- 実機で`MaterialFactory.phongMaterial()`/`gouraudMaterial()`それぞれを使ったシーンを描画し、リファクタ前と見た目が変わらないこと確認する（純粋なコード移動のため見た目は変わらないはずだが、`RendererContext.setLights()`の呼び出し元が現状存在しないため、光源が実際に反映されているかどうかの検証自体は`gouraud-phong-alignment.md`と同じ制約を受ける）。

## 実装分担についての注意

`LitMaterial`という新しい中間抽象クラスを`~Material`ファミリーへ導入するのは、既存の確立済みパターンをそのまま適用するだけの機械的反映ではなく、そのファミリー初の新しいアーキテクチャ上の判断にあたる（`~Material`ファミリーはこれまで`BaseMaterial`→具象14クラスの一段構成で、中間の抽象クラス階層を持ったことがない）。`.claude/CLAUDE.md`の編集範囲制限により、会話でここまで詳細に設計が固まっていても、`src/`配下（`LitMaterial.ts`新規作成、`PhongMaterial.ts`/`GouraudMaterial.ts`/`MaterialFactory.ts`/`index.ts`の書き換え）の実際のコード変更は原則ユーザー自身が行う。

実装が完了しコードとして実在するパターンになった時点で、`.claude/rules/material.md`の「構成」節・変更履歴への反映（`glspinner-conventions`の管轄）を検討する。

## この提案の経緯

`design/gouraud-phong-alignment.md`のレビュー（GouraudとPhongで反射モデルの計算式が似ているのは「いつ計算するか」が違うだけで正しい、という確認）を経て実装が完了した後、ユーザーから「PhongとGouraudのMaterialの作りがほぼ同じなので、シェーダーの区別は保ったままTypeScript側だけまとめられないか」という相談があった。`glspinner-design`スキルでプランモードに入り、実際に`PhongMaterial.ts`/`GouraudMaterial.ts`が完全に同一のコードになっていること、`src/`内で両クラスを参照するのは`MaterialFactory.ts`のみで`instanceof`等の型依存が無いことを確認した上で、`BaseMaterial`と2具象クラスの間に`LitMaterial`を新設する案（`UnlitMaterial`と対になる命名、`~Application`ファミリーの2段抽象クラスの前例に倣う）で合意した。

## 将来のライティング拡張との関係（Lambert/トゥーン/PBR/AO/セルフシャドウ）

本設計の合意後、「今後のライティング拡張（PBR、トゥーン、Lambert、アンビエントオクルージョン、セルフシャドウイング）を見据えたときにこの構成でよいか」という追加相談があったため、検討結果を記録する。ライティング関連の拡張は独立した2つの軸に分けて考える必要がある。

### 反射モデル軸とシェーディング頻度軸は別物——LambertはGouraudと同義ではない

- **反射モデル軸**（何を計算するか）: Lambert（拡散反射のみ、鏡面ハイライト無し）／Blinn-Phong（拡散+鏡面、`shininess`を使う現在のPhong/Gouraud）／トゥーン（段階的に量子化した拡散+簡易鏡面）／PBR（物理ベースBRDF、albedo/metallic/roughness等）
- **シェーディング頻度軸**（いつ計算するか）: 頂点ごとに計算して最終色を補間する（Gouraud）／フラグメントごとに計算する（いわゆる「Phongシェーディング」。この文書内の`PhongMaterial`が指すのはこちら）

Gouraudは反射モデルの名前ではなく「頂点で計算する」という評価タイミングの名前であり、この2軸は独立している。現在の`GouraudMaterial`は正確には「Blinn-Phong反射モデルを頂点ごとに評価するもの」であってLambertではない。Lambert（拡散のみ、`shininess`もspecular項も持たない）を実装する場合は、反射モデル軸上で別の第3のバリエーションとして扱う必要があり、それをさらに頂点/フラグメントいずれで評価するかは別途選べる（Gouraud-Lambert、Phong-Lambertの両方があり得る）。

### `LitMaterial`が共通化しているのは「反射モデル」ではなく「光源データの配線」

`LitMaterial`が実際にまとめているのは以下の2点であり、いずれも特定の反射モデルに依存しない:

1. `context.getCamera()`/`context.getLights()`から自己完結で光源を取り出す仕組み
2. `LightType`でDirectional/Point/Ambientに振り分けてuniformへ流し込む仕組み

この性質から、将来の拡張がどこまで`LitMaterial`に乗るかは反射モデルごとに異なる:

- **トゥーンシェーディング**: 多くの実装は同じBlinn-Phong系の`N·L`/`N·H`計算をフラグメントシェーダーで行い、結果を段階的に量子化するだけなので、`LitMaterial`の光源集めロジックはそのまま流用できる。`PhongMaterial`/`GouraudMaterial`と並ぶ第3の子クラスとして自然に収まる想定で、バンド数などトゥーン固有のパラメータは「将来Phong/Gouraudのどちらかだけに固有パラメータが増えた場合」と同じ扱いでそのクラスにだけ追加すればよい。
- **PBR**: `shininess`という発想自体がBlinn-Phong特有であり、PBRは`albedo`/`metallic`/`roughness`のような全く異なるパラメータ集合を使う。さらに`LightParams`（`color`/`intensity`/`direction`or`position`のみ、`LightConstants.ts`）は物理ベースの減衰（inverse-square falloff）や面光源を想定していないため、PBRに本格対応する場合は光源システム自体の拡張が必要になる可能性が高い。PBRを現在の`LitMaterial`に無理に乗せると、使われない`shininess`フィールドを抱える不自然なクラスになるため、**PBRは`LitMaterial`とは別に`BaseMaterial`直下の新しい兄弟系統として設計するのが妥当**と考える。「光源を集めてループする」部分だけをクラス継承ではなく共通関数として括り出す判断もあり得るが、それはPBR着手時に実際のコードを見ながら`glspinner-design`で改めて検討する。

### アンビエントオクルージョン・セルフシャドウイングはMaterial層よりパイプライン層の話

- **セルフシャドウイング（シャドウマップ）**: ライト視点からの深度パス（新しい`RenderTargetSlot`＋新しい`RendererFlow`）を追加し、`RendererContext`がシャドウマップと光空間行列を持つようにする、というパイプライン側の配線が主体（`.claude/rules/pipeline.md`/`render-target.md`/`flow.md`参照）。最終的に「シャドウマップを参照して影を落とす」処理はPhong/Gouraud/トゥーンいずれの`setUniform()`にも共通して必要になるため、実装時には`LitMaterial`に`setShadowUniforms()`のようなメソッドを追加することになる想定。これは本設計を壊す変更ではなく素直な追加拡張として収まる。
- **アンビエントオクルージョン**: 多くはSSAOのようなスクリーンスペース後処理（既存の`~Pass`/`BaseShaderPass`ポストエフェクト系、`.claude/rules/pass.md`参照）として実装され、Material側にはほぼ影響しない。頂点ベースの焼き込みAOを行う場合のみMaterial側に手が入るが、優先度は低いと考えられる。

### まとめ

`LitMaterial`は「Blinn-Phong系（Phong/Gouraud、おそらくトゥーンも）の光源集め」を束ねる基底として適切だが、PBRは同じ枠に無理に押し込めず`BaseMaterial`直下の別系統として設計し直すのが妥当。AO/セルフシャドウイングはおおむねパイプライン層の話でMaterial層への影響は限定的（セルフシャドウイングは`LitMaterial`への追加拡張という形で収まる見込み）。PBR・シャドウマップいずれも、実際に着手するタイミングで改めて`glspinner-design`による個別の設計検討が必要な規模。

## 変更履歴

- 2026-09-05: 初版作成時の設計合意に加え、将来のライティング拡張（Lambert/トゥーン/PBR/AO/セルフシャドウ）との関係についての検討結果を「将来のライティング拡張との関係」節として追記した。
