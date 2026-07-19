# `~Pipeline` ファミリー規約

`src/scene/renderer/pipeline/`配下。`XxxOperation`インターフェースは持つが、**具象クラスが1つしかなく`BaseXxx`層が存在しない**（`operation-base.md`の小規模ファミリー節と同種の変則パターンだが、ユーザーが明示的に挙げたファミリーのため独立ファイルとして扱う）。

## 構成

- `SceneRendererPipelineOperation`（インターフェース）
- `SceneRendererPipeline`（唯一の具象クラス。`implements SceneRendererPipelineOperation`を直接実装、`BaseSceneRendererPipeline`のような中間層はない）

新たに2つ目のPipeline実装が必要になった場合に初めて`BaseXxx`層を挟むかどうかを検討する（`glspinner-design`の仕事）。現状は1実装のみのため、無理に抽象層を先回りして作らない。

## 内部構造の特徴

```ts
export class SceneRendererPipeline implements SceneRendererPipelineOperation {
    private sceneRendererFlows: RendererFlowOperation[];
    private postEffectFlows: RendererFlowOperation[];
    private finalBlitFlow: RendererFlowOperation = {
        render: () => { /* 何もしない */ },
        isEnabled: () => { return false; }
    };
    ...
    addSceneRendererFlow(rendererFlow: RendererFlowOperation): void { this.sceneRendererFlows.push(rendererFlow); }
    addPostEffectFlow(rendererFlow: PostEffectRendererFlow): void { this.postEffectFlows.push(rendererFlow); }
    addFinalBlitFlow(rendererFlow: FinalBlitRendererFlow): void { this.finalBlitFlow = rendererFlow; }
}
```

- `finalBlitFlow`の初期値が**オブジェクトリテラルによる`RendererFlowOperation`のインラインダミー実装**（`{ render: ()=>{}, isEnabled: ()=>false }`）になっている点は他ファミリーに見られない書き方。`addFinalBlitFlow()`が呼ばれるまでの「何もしない」プレースホルダとして使われている。同様のプレースホルダが必要になった場合はこの書き方を踏襲してよい。
- `addSceneRendererFlow`/`addPostEffectFlow`/`addFinalBlitFlow`という`addXxx`命名の登録メソッド群で、アプリ側（`setup()`）が任意にパイプラインを組み立てる（配列にpushするだけ、または単一フィールドを差し替えるだけ）。新規の登録ポイントを増やす場合もこの`addXxx`命名に合わせる。

## `render()`のping-pong方式

```ts
render(gl, context) {
    const rtRegistry = context.getRenderTargetRegistry();
    let readRT = rtRegistry.getRenderTargetFromPool(TEMP_FRAME_BUFFER)!;
    let writeRT = rtRegistry.getRenderTargetFromPool(CURRENT_FRAME)!;

    // 1. 不透明オブジェクトをシーンとして描画
    this.renderScene(gl, context, [OPAQUE], this.sceneRendererFlows, readRT, writeRT);
    [readRT, writeRT] = [writeRT, readRT];

    // 2. 有効なポストエフェクトを順番に適用（ping-pongでread/writeを交換しながらチェーン）
    for (const postEffect of this.postEffectFlows.filter(f => f.isEnabled())) {
        postEffect.render(gl, context, readRT, writeRT);
        [readRT, writeRT] = [writeRT, readRT];
    }

    // 3. 画面へ最終ブリット
    const screenTarget = rtRegistry.getScreenRenderTarget();
    this.finalBlitFlow.render(gl, context, readRT, screenTarget);

    // 4. オーバーレイ（テキストなど）を画面に直接重ね描き
    this.renderScene(gl, context, [OVERLAY], this.sceneRendererFlows, readRT, screenTarget);
}
```

`read`/`write`の2枚のRT（`RenderTargetOperation`、`render-target.md`参照）を交互に入れ替える**ping-pong方式**でポストエフェクトチェーンを実現し、無効化されたエフェクトは`gl.blitFramebuffer`バイパス（`flow.md`参照）でコストを抑えつつチェーンの整合性（read/write交換）を保つ。OVERLAYパス（`node.md`の`TextMeshNode`等）はポストエフェクト適用後・画面ブリット後に実行されるため、テキストなどは常にポストエフェクトの影響を受けない最前面レイヤーとして描かれる。

## `RenderTag`（描画レイヤー分類）

```ts
export const RenderTagConstants = {
    BACKGROUND: 0, OPAQUE: 1, EMISSIVE: 2, TRANSPARENT: 3,
    DISTORTION: 4, OVERLAY: 5, ALL: -1,
} as const;
```

`context.setActivateRenderTag(tag)`を呼んでからシーングラフを走査することで「このパスでは不透明オブジェクトだけ描く」「テキストはポストエフェクト後に重ねる」といった制御を実現する（`node.md`の`SceneNode.shouldDraw()`参照）。**`BACKGROUND`/`EMISSIVE`/`TRANSPARENT`/`DISTORTION`は定義のみで、現状の`render()`実装では`OPAQUE`/`OVERLAY`しか使われていない**。新規パスを追加する際にこれらの未使用タグを使い始めるのは妥当だが、その場合パイプライン側（`renderScene`の呼び出し箇所）への配線追加が必要になる。

## `RendererContext`（フレーム単位の共有状態）

`RendererContext`（`src/scene/renderer/RendererContext.ts`）は「1フレームの描画に必要な共有情報」を集約するハブで、`~Pipeline`/`~Flow`/`~Pass`/`~Node`のほぼ全メソッドが引数として受け取る中心的インフラ:

- `camera`（`node.md`の`Camera`参照）, `lights`（`LightParams[]`。`setLights()`は定義されているが**呼び出し元がプロジェクト内に存在しない**——`getLights()`は`material.md`の`PhongMaterial`連携等で使われているが、投入する側の配線が無いサイレントな未接続箇所）
- `globalUniforms`（Uniform名→値の辞書。マテリアルはここから必要な値を読んでシェーダへ流す。`updateGlobalUniform()`/`getGlobalUniform()`）
- `globalUniformBuffer`（`ShaderUniformBuffer` = UBO。view/projection行列、time、resolution、mouseを`GlobalUniforms`ブロックとして`bindGlobalUniforms()`で`UniformBindingPoint.GLOBAL`（binding=0）にバインド。詳細は`buffer.md`）
- `currentShaderProgram`（同一シェーダプログラムの再バインドを避けるための状態キャッシュ。`setCurrentShaderProgram()`/`isCurrentShaderProgramSame()`を`material.md`の`BaseMaterial.use()`が参照する）
- `renderTargetRegistry`（`getRenderTargetRegistry()`。`render-target.md`参照）
- `activateRenderTag`（`setActivateRenderTag()`/`getActivateRenderTag()`。上記`RenderTag`参照）

## `~Flow`ファミリーとの関係

`SceneRendererPipeline`は`RendererFlowOperation`型の配列・フィールドを保持するオーケストレーション層で、実際の描画ロジックは持たない。各`RendererFlowOperation`実装（`flow.md`参照）に処理を委譲する。
