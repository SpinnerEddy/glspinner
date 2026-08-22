# scene/renderer — レンダリングパイプライン（ポストエフェクトチェーン付き多段パイプライン）

## 概要

`src/scene/renderer/`は、glspinnerの中核をなす多段レンダリングパイプライン。`SceneRendererPipeline`（1フレームを統括）→`RendererFlowOperation[]`（描画フェーズの並び）→`ShaderPassOperation`（個々のポストエフェクト）という3層構造で、各層は直接参照ではなくスロット/タグを介して疎結合になっている。`RenderTag`が描画対象ノードを絞り込み、`RenderTargetRegistry`がFBO（`webgl/gl/fbo/`、`RenderTargetOperation`ファミリー）をスロット名で貸し出すプールとして働く。

## アーキテクチャ全体図

```
SceneRendererPipeline.render()
 │
 ├─ 1. renderScene([OPAQUE])         … StandardSceneRendererFlow がシーングラフを走査して不透明オブジェクトを描画
 │       readRT(TEMP_FRAME_BUFFER) ⇄ writeRT(CURRENT_FRAME) を交換
 │
 ├─ 2. postEffectFlows.filter(isEnabled) を順に適用（ping-pong）
 │       PostEffectRendererFlow → ShaderPassOperation.render(readRT, writeRT)
 │       無効なエフェクトは gl.blitFramebuffer でバイパス
 │       各パス後に [readRT, writeRT] = [writeRT, readRT]
 │
 ├─ 3. finalBlitFlow.render(readRT, screenTarget)   … オフスクリーンRT → 画面(ScreenRenderTarget)
 │
 └─ 4. renderScene([OVERLAY])         … ポストエフェクト適用後・画面ブリット後にテキスト等を最前面へ重ね描き
```

`RenderTargetRegistry`がスロット名（`RenderTargetSlot`）でFBOを貸し出すプール、`RenderTag`が「このパスで誰を描くか」を決めるフィルタ。両方とも実体を直接やり取りせず、キー経由でのみ結びつく。

## 主要クラス一覧

| クラス/ファイル | 役割 | 備考 |
|---|---|---|
| `RendererContext.ts` | フレーム単位の共有状態ハブ | camera/lights/UBO/現在シェーダ/RTレジストリ/アクティブタグ |
| `definition/RenderTag.ts` | 描画レイヤー分類の定数 | 7種のうち配線済みはOPAQUE/OVERLAYのみ |
| `pipeline/SceneRendererPipeline.ts` | 1フレーム全体のオーケストレーション | `BaseXxx`層なしの唯一の具象クラス |
| `flow/BaseSceneRendererFlow.ts` + 3具象 | 描画フェーズ単位のFlow | Standard/PostEffect/FinalBlit |
| `postEffect/BaseShaderPass.ts` + 10具象 | 個々のポストエフェクトパス | `BloomShaderPass`のみ例外的にインターフェース直接実装 |
| `context/RenderTargetRegistry.ts` | FBOのスロットベースプール | `Map<RenderTargetSlotKey, RenderTargetOperation>` |
| `webgl/gl/fbo/RenderTargetOperation.ts` + 4具象 | FBOラッパー | `RenderTarget`/`CustomRenderTarget`/`ScreenRenderTarget`/`PingPongRenderTarget` |

## Pipeline層

```ts
export class SceneRendererPipeline implements SceneRendererPipelineOperation {
    private sceneRendererFlows: RendererFlowOperation[] = [];
    private postEffectFlows: RendererFlowOperation[] = [];
    private finalBlitFlow: RendererFlowOperation = { render: () => {}, isEnabled: () => false }; // インラインダミー実装

    addSceneRendererFlow(flow): void { this.sceneRendererFlows.push(flow); }
    addPostEffectFlow(flow): void { this.postEffectFlows.push(flow); }
    addFinalBlitFlow(flow): void { this.finalBlitFlow = flow; }

    render(gl, context): void {
        if (!this.finalBlitFlow.isEnabled()) {
            // finalBlitFlowが未設定なら、オフスクリーンRTを経由せず画面へ直接描画するフォールバック
            this.renderSceneUnusedRenderTarget(gl, context);
            return;
        }

        const rtRegistry = context.getRenderTargetRegistry();
        let readRT = rtRegistry.getRenderTargetFromPool(RenderTargetSlot.TEMP_FRAME_BUFFER)!;
        let writeRT = rtRegistry.getRenderTargetFromPool(RenderTargetSlot.CURRENT_FRAME)!;

        this.renderScene(gl, context, [RenderTagConstants.OPAQUE], this.sceneRendererFlows, readRT, writeRT);
        [readRT, writeRT] = [writeRT, readRT];

        const activePostEffects = this.postEffectFlows.filter((flow) => flow.isEnabled());
        for (const postEffect of activePostEffects) {
            postEffect.render(gl, context, readRT, writeRT);
            [readRT, writeRT] = [writeRT, readRT];
        }

        const screenTarget = rtRegistry.getScreenRenderTarget();
        this.finalBlitFlow.render(gl, context, readRT, screenTarget);

        this.renderScene(gl, context, [RenderTagConstants.OVERLAY], this.sceneRendererFlows, readRT, screenTarget);
    }

    private renderScene(gl, context, tags, flows, readRT, writeRT): void {
        for (const tag of tags) {
            context.setActivateRenderTag(tag);
            for (const flow of flows) {
                flow.render(gl, context, readRT, writeRT);
            }
        }
    }
}
```

`read`/`write`の2枚のRTを交互に入れ替える**ping-pong方式**でポストエフェクトチェーンを実現する。無効化されたエフェクト（`PostEffectRendererFlow`側で`gl.blitFramebuffer`によりパススルー）でもread/write交換自体は起きるため、エフェクトのON/OFF切り替えがチェーンの整合性を崩さない。

`finalBlitFlow`の初期値がオブジェクトリテラルによる`RendererFlowOperation`のインラインダミー実装（`{render:()=>{}, isEnabled:()=>false}`）になっている点はこのファミリー内で唯一の書き方。`addFinalBlitFlow()`が呼ばれない場合、`render()`は`renderSceneUnusedRenderTarget()`という別経路にフォールバックし、`ScreenRenderTarget`へ直接OPAQUE→OVERLAYの順で描画する（オフスクリーンRTやポストエフェクトチェーンを一切経由しない、最小構成での動作）。

`SceneRendererPipelineOperation`インターフェースは持つが、`BaseSceneRendererPipeline`のような中間`Base`層は無く、`SceneRendererPipeline`が唯一の具象クラス（2つ目の実装が必要になった時点で抽象層を検討する設計）。

## Flow層

```ts
export interface RendererFlowOperation {
    render(gl, context, inputRenderTarget, outputRenderTarget): void;
    isEnabled(): boolean;
}
export abstract class BaseSceneRendererFlow implements RendererFlowOperation {
    abstract render(gl, context, inputRenderTarget, outputRenderTarget): void;
    abstract isEnabled(): boolean;
}
```

`BaseSceneRendererFlow`は共通実装を持たない薄い層（インターフェースをそのまま`abstract`化しただけ）。命名も`BaseFlow`ではなく`BaseSceneRendererFlow`という、ファミリーの通称「Flow」より長い正式名になっている。

- **`StandardSceneRendererFlow`**: `sceneGraphRoot: EmptyNode`を保持し、`outputRenderTarget.bindAsDrawTarget()`後、`activateRenderTag === OPAQUE`のときだけ`gl.clear()`する。`SceneGraphUtility.traverse()`でシーングラフを走査し、`node.shouldDraw(context)`が真のノードだけ`node.draw(gl, context)`する。`isEnabled()`は常に`true`。
- **`PostEffectRendererFlow`**: `ShaderPassOperation`を1つラップする。`shaderPass.getEffectEnabled()`が`false`なら`gl.blitFramebuffer`で入力をそのまま出力へコピーしてパススルーする。
- **`FinalBlitRendererFlow`**: `ShaderPassOperation`（典型的には`FinalBlitShaderPass`）をラップし、オフスクリーンRTの内容を画面（`ScreenRenderTarget`）へ描き出す専用フロー。`isEnabled()`は常に`true`——`SceneRendererPipeline`側は`finalBlitFlow`が未設定（インラインダミーのまま）かどうかで判定するため、このフラグは「設定済みなら常に有効」という意味になる。

## ShaderPass層

```ts
export interface ShaderPassOperation {
    render(gl, context, inputRenderTarget, outputRenderTarget): void;
    setEffectEnabled(enabled: boolean): void;
    getEffectEnabled(): boolean;
}
export abstract class BaseShaderPass implements ShaderPassOperation {
    protected material: BaseMaterial;
    protected plane: MeshNode;
    protected isEffectEnabled = true;

    constructor(gl, material: BaseMaterial) {
        this.material = material;
        const planeGeometry = new Plane(gl, 2, 2);
        const planeAttributes = { aPosition: material.getAttribute(gl,'aPosition'), aColor: ..., aUv: ... };
        planeGeometry.setUpBuffers(gl, planeAttributes);
        this.plane = new MeshNode(new UnlitMesh(planeGeometry, material));
    }

    abstract render(gl, context, inputRenderTarget, outputRenderTarget): void;
    setEffectEnabled(enabled): void { this.isEffectEnabled = enabled; }
    getEffectEnabled(): boolean { return this.isEffectEnabled; }
    protected draw(gl, context, outputRenderTarget): void {
        outputRenderTarget.bindAsDrawTarget();
        SceneGraphUtility.traverse(this.plane, (node) => node.draw(gl, context));
    }
}
```

コンストラクタで「フルスクリーンの`Plane`(2x2) + `UnlitMesh` + `MeshNode`」を組み立てるところまでを共通化し、`render()`だけが具象クラスの責務。

具象クラス9個（`GrayScaleShaderPass`, `MosaicShaderPass`, `RGBShiftShaderPass`, `GlitchShaderPass`, `BrightShaderPass`, `BlurShaderPass`, `SingleDirectionBlurShaderPass`, `ComposeShaderPass`, `MaskShaderPass`, `FinalBlitShaderPass` ※数え方により9〜10個）は、いずれも次の定型パターンを踏襲する:

```ts
render(gl, context, inputRenderTarget, outputRenderTarget): void {
    const texture = inputRenderTarget.getColorTexture(0);
    gl.activeTexture(gl.TEXTURE0 + TextureSlot.CURRENT_FRAME);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    this.draw(gl, context, outputRenderTarget);
    gl.bindTexture(gl.TEXTURE_2D, null);
}
```

「入力RTのカラーテクスチャを取得 → テクスチャユニットにバインド → `this.draw()` → アンバインド」という定型。`ComposeShaderPass`だけは追加で`bloomTexture`（`setBloomTexture(bloomFrame)`で外部から注入）を`TextureSlot.BLOOM_FRAME`にもバインドする2テクスチャ構成。

`BlurShaderPass`と`SingleDirectionBlurShaderPass`はほぼ同一の実装（`BlurMaterial`を受け取り同じ定型`render()`を持つ）で、`BloomShaderPass`が内部で使うのは`SingleDirectionBlurShaderPass`側。

### `BloomShaderPass`（例外: `BaseShaderPass`を継承しない）

```ts
export class BloomShaderPass implements ShaderPassOperation {
    private brightShaderPass: BrightShaderPass;
    private horizontalBlurShaderPass: SingleDirectionBlurShaderPass;
    private verticalBlurShaderPass: SingleDirectionBlurShaderPass;
    private composeShaderPass: ComposeShaderPass;

    render(gl, context, inputRenderTarget, outputRenderTarget): void {
        const rtRegistry = context.getRenderTargetRegistry();
        const brightTempRT = rtRegistry.getRenderTargetFromPool(RenderTargetSlot.BRIGHT_PASS_BUFFER)!;
        this.brightShaderPass.render(gl, context, inputRenderTarget, brightTempRT);

        const tempPPRT = rtRegistry.getPingPongRenderTargetFromPool(RenderTargetSlot.PINGPONG_TEMP_BUFFER)!;
        this.horizontalBlurShaderPass.render(gl, context, brightTempRT, tempPPRT.write);
        tempPPRT.swap();
        this.verticalBlurShaderPass.render(gl, context, tempPPRT.read, tempPPRT.write);

        this.composeShaderPass.setBloomTexture(tempPPRT.write);
        this.composeShaderPass.render(gl, context, inputRenderTarget, outputRenderTarget);
    }

    setEffectEnabled(enabled): void {
        // 内部4パス全てへ伝播
        this.brightShaderPass.setEffectEnabled(enabled);
        this.horizontalBlurShaderPass.setEffectEnabled(enabled);
        this.verticalBlurShaderPass.setEffectEnabled(enabled);
        this.composeShaderPass.setEffectEnabled(enabled);
    }
}
```

内部で他の`~ShaderPass`（Bright→横Blur→縦Blur→Compose）を保持して順に呼び出す複合エフェクト。`BRIGHT_PASS_BUFFER`と`PINGPONG_TEMP_BUFFER`という専用スロットを`RenderTargetRegistry`から取得して使い回す。単一`material`+`plane`という`BaseShaderPass`の前提に収まらないため、`ShaderPassOperation`を直接実装する唯一の例外になっている。`examples/sample.ts`では現状コメントアウトされて無効化されている。

## RenderTarget（FBO）層

`src/webgl/gl/fbo/`配下。`operation-base.md`の標準形から最も外れたファミリーの一つ——`BaseXxx`層が存在せず、しかも具象クラスの1つ（`PingPongRenderTarget`）は`RenderTargetOperation`すら実装しない。

```ts
export interface RenderTargetOperation {
    bindAsDrawTarget(): void;
    getFrameBuffer(): WebGLFramebuffer;
    getColorTexture(index: number): WebGLTexture;
    getDepthTexture(): WebGLTexture;
    getSize(): [number, number];
    resize(resolution: [number, number]): void;
    dispose(): void;
}
```

- **`RenderTarget`**: 単一カラーテクスチャ+オプションの深度レンダーバッファを持つ標準FBO。`getColorTexture(index)`は`index !== 0`なら`throw`（単一アタッチメント限定）。`getDepthTexture()`は未実装で`throw`。
- **`CustomRenderTarget`**: `AttachmentType`（COLOR/ID/NORMAL/EMISSIVE/DEPTH/DEPTH_TEXTURE/STENCIL/DEPTH_STENCIL）を任意組み合わせでアタッチできるMRT対応版。`option.attachments`配列を順に処理し、色系アタッチメントは`gl.drawBuffers()`で複数出力に対応、深度系はレンダーバッファまたはテクスチャとして構成できる。G-buffer的な用途を想定した拡張ポイントだが、現状のパイプラインでは単一カラーアタッチメントの用途にしか使われていない。`examples/sample.ts`では`CustomRenderTarget`が既定のRT実装として使われている（`RenderTarget`より先に採用されている）。
- **`ScreenRenderTarget`**: フレームバッファ`null`（＝画面）を表すダミー実装。`bindAsDrawTarget()`は`gl.bindFramebuffer(FRAMEBUFFER, null)`のみ。テクスチャ取得系メソッド（`getColorTexture`/`getDepthTexture`/`getFrameBuffer`）はすべて`throw`（画面はテクスチャとして読み出せないため）。
- **`PingPongRenderTarget`**: `RenderTargetOperation`を実装しない独立クラス。2枚の`RenderTargetOperation`を`targets: [A, B]`として持ち、`get read`/`get write`アクセサと`swap()`（`readIndex`を反転）で入れ替える。`getColorTexture`/`getDepthTexture`/`resize`/`dispose`は同名メソッドとして生えているが、インターフェースとしての契約は無い。

`RenderTarget.ts`は`===`/`!==`（`resize()`内の`this.width === resolution[0] && this.height === resolution[1]`）を使っており、プロジェクト全体の等価比較演算子の揺れの一例。

### `RenderTargetRegistry`（スロットベースのプール）

```ts
export class RenderTargetRegistry implements RenderTargetRegistryOperation {
    private renderTargetPool: Map<RenderTargetSlotKey, RenderTargetOperation> = new Map();
    private pingPongRenderTargetPool: Map<RenderTargetSlotKey, PingPongRenderTarget> = new Map();
    private screenRenderTarget: ScreenRenderTarget | undefined;

    getRenderTargetFromPool(slot): RenderTargetOperation | undefined { ... }
    addRenderTargetToPool(slot, rt): void { this.renderTargetPool.set(slot, rt); }
    getPingPongRenderTargetFromPool(slot): PingPongRenderTarget | undefined { ... }
    addPingPongRenderTargetToPool(slot, ppRT): void { ... }
    getScreenRenderTarget(): ScreenRenderTarget { return this.screenRenderTarget!; }
    setScreenRenderTarget(rt): void { this.screenRenderTarget = rt; }
    dispose(): void { /* 全プールを解放してclear() */ }
}
```

```ts
export const RenderTargetSlot = {
    CURRENT_FRAME: 0, TEMP_FRAME_BUFFER: 1, PREV_FRAME: 2,
    HALF_RES_BUFFER: 3, BRIGHT_PASS_BUFFER: 4, BLOOM_RENDER_TARGET: 5,
    PINGPONG_TEMP_BUFFER: 100,
} as const;
```

`~Pass`/`~Flow`/`~Pipeline`はいずれもこのプールからスロット指定で`RenderTargetOperation`を取り出して使う疎結合設計——互いへの参照を直接持たない。`examples/sample.ts`の`setup()`では`CURRENT_FRAME`/`TEMP_FRAME_BUFFER`/`HALF_RES_BUFFER`/`BRIGHT_PASS_BUFFER`を`CustomRenderTarget`として登録し、`PINGPONG_TEMP_BUFFER`を`PingPongRenderTarget`として登録する、という初期配線を行う。`PREV_FRAME`/`BLOOM_RENDER_TARGET`スロットは定義のみで現状未使用。

## RendererContext

```ts
export class RendererContext {
    private camera: Camera | undefined;
    private lights: LightParams[] = [];
    private currentShaderProgram: ShaderProgram | undefined;
    private renderTargetRegistry: RenderTargetRegistryOperation;
    private activateRenderTag: RenderTag = RenderTagConstants.ALL;
    private globalUniformBuffer: ShaderUniformBuffer;

    constructor(gl) {
        this.renderTargetRegistry = new RenderTargetRegistry();
        // viewMatrix/projectionMatrix/time/resolution/mouseの5値でGlobalUniformsのUBOを初期化
        this.globalUniformBuffer = new ShaderUniformBuffer(gl, { ... });
        this.globalUniformBuffer.setData();
    }

    getRenderTargetRegistry() / setActivateRenderTag() / getActivateRenderTag()
    setCamera(camera) / getCamera()
    setLights(lights) / getLights()
    setCurrentShaderProgram(program) / isCurrentShaderProgramSame(program)

    updateGlobalUniformValues(time, mousePos): void {
        // TIME/MOUSEを毎フレーム更新、cameraがあればVIEW_MATRIX/PROJECTION_MATRIXも更新
    }
    bindGlobalUniforms(): void {
        this.globalUniformBuffer.transferUniform();
        this.globalUniformBuffer.bind(UniformBindingPoint.GLOBAL);
    }
}
```

「1フレームの描画に必要な共有情報」を集約するハブで、`~Pipeline`/`~Flow`/`~Pass`/`~Node`のほぼ全メソッドが引数として受け取る中心的インフラ。以前は`globalUniforms`/`fragmentCanvasUniforms`という2つの可変辞書（Uniform名→値）を持ち、マテリアルがここから値を読んでいたが、複数ノードを跨いだ書き込み順序に依存し「値が1描画分遅延して送られる」という実バグの温床になっていたため、2026-07のリファクタで完全に削除された。各`~Material`（`docs/scene/material.md`参照）は必要な値を`setUniform()`の引数（`transform`）や`context.getCamera()`/`context.getLights()`から自己完結して取得する形に置き換わっている。

## RenderTag

```ts
export const RenderTagConstants = {
    BACKGROUND: 0, OPAQUE: 1, EMISSIVE: 2, TRANSPARENT: 3,
    DISTORTION: 4, OVERLAY: 5, ALL: -1,
} as const;
```

`context.setActivateRenderTag(tag)`を呼んでからシーングラフを走査することで「このパスでは不透明オブジェクトだけ描く」「テキストはポストエフェクト後に重ねる」といった制御を実現する（`SceneNode.shouldDraw()`参照、`docs/scene/core.md`）。**`BACKGROUND`/`EMISSIVE`/`TRANSPARENT`/`DISTORTION`は定義のみで、現状`SceneRendererPipeline.render()`が使うのは`OPAQUE`/`OVERLAY`のみ**。

## 他モジュールとの関係

- **`scene/core.md` (`SceneNode`/`SceneGraphUtility`)**: `StandardSceneRendererFlow`が走査対象として保持する。
- **`scene/material.md`/`scene/mesh.md`**: `BaseShaderPass`がフルスクリーンプレーン描画に`UnlitMesh`+ポストエフェクト用マテリアルを組み合わせる。
- **`scene/factory.md` (`MaterialFactory`)**: 各`~ShaderPass`のコンストラクタへ渡すマテリアルはここから生成する。
- **`webgl/gl.md` (`ShaderUniformBuffer`/`ShaderProgram`)**: `RendererContext`のUBO転送と`GlobalUniforms`ブロックの自動バインドで接続する。
- **`app/app.md` (`BaseApplication`)**: コンストラクタで`RendererContext`/`SceneRendererPipeline`を1つずつ生成する。パイプライン自体の組み立て（`addSceneRendererFlow`等）は利用者側`setup()`が行う。

## 既知の制約・未完成部分

- `RenderTag`のうち`BACKGROUND`/`EMISSIVE`/`TRANSPARENT`/`DISTORTION`は未配線。
- `RenderTargetSlot`のうち`PREV_FRAME`/`BLOOM_RENDER_TARGET`は定義のみで現状未使用。
- `CustomRenderTarget`のMRT機能（複数アタッチメント）は実装済みだが、現状のパイプラインでは単一カラーアタッチメント用途にしか使われていない。
- `BloomShaderPass`は`examples/sample.ts`上でコメントアウトされ無効化されたままになっている。
- `BlurShaderPass`と`SingleDirectionBlurShaderPass`はほぼ同一の実装が並存しており、`BloomShaderPass`が使うのは後者のみ。
- `flow/FinalBlitRenderFlow.ts`というファイル名に対し、中のクラス名は`FinalBlitRendererFlow`（"Render"ではなく"Renderer"）——`general.md`が定める「ファイル名とクラス名は1:1で完全一致する」という規約からの逸脱。
- `UniformBindingPoint`の`MATERIAL`/`OBJECT`/`LIGHT`/`DEBUG`は定義のみで、`src/`内のどこからも参照されていない（`GLOBAL`のみ実配線）。
