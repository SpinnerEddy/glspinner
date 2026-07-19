# `~Flow`（RendererFlow）ファミリー規約

`src/scene/renderer/flow/`配下。`XxxOperation`+`BaseXxx`の形はとるが、**`BaseXxx`の命名が`BaseFlow`ではなく`BaseSceneRendererFlow`**という、インターフェース名（`RendererFlowOperation`）とも具象クラス名（`~RendererFlow`）とも微妙に異なる独自の命名になっている点がこのファミリーの特徴。新規ファミリーを作る際、抽象クラス名を機械的に`Base`+ファミリー呼称にできない実例として参考にする。

## 構成

- `RendererFlowOperation`（インターフェース）
- `BaseSceneRendererFlow`（抽象基底。`Base` + `SceneRendererFlow`という、ファミリーの通称「Flow」より長い正式名を使っている）
- 具象クラス3個: `StandardSceneRendererFlow`, `PostEffectRendererFlow`, `FinalBlitRendererFlow`（いずれも`~RendererFlow`という接尾辞で統一されており、`BaseSceneRendererFlow`だけ`Renderer`と`Flow`の順序が異なる）

## `BaseSceneRendererFlow`

```ts
export abstract class BaseSceneRendererFlow implements RendererFlowOperation {
    abstract render(gl, context, inputRenderTarget, outputRenderTarget): void;
    abstract isEnabled(): boolean;
}
```

共通実装は一切なく、インターフェースをそのまま`abstract`宣言に写しただけの薄い層（`device.md`の`BaseDevice`と同種の「共通ロジックなしBase」）。実質的には型として`BaseSceneRendererFlow`を経由させているだけで、新規Flowを追加する際に共通化できる処理があるかどうかは都度確認する。

## 具象クラスの役割分担

- **`StandardSceneRendererFlow`**: シーングラフを`SceneGraphUtility.traverse`で走査し、`node.shouldDraw(context)`が真のノードだけ描画する「通常のシーン描画」担当。
- **`PostEffectRendererFlow`**: `ShaderPassOperation`（`pass.md`）を1つラップする。無効時は`gl.blitFramebuffer`でパススルーする、という「エフェクトのON/OFF切り替えをコストなく行う」既存パターンの実装箇所そのもの。

```ts
export class PostEffectRendererFlow extends BaseSceneRendererFlow {
    private shaderPass: ShaderPassOperation;

    render(gl, context, inputRenderTarget, outputRenderTarget): void {
        if (!this.shaderPass.getEffectEnabled()) {
            gl.bindFramebuffer(gl.READ_FRAMEBUFFER, inputRenderTarget.getFrameBuffer());
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, outputRenderTarget.getFrameBuffer());
            gl.blitFramebuffer(
                0, 0, inputRenderTarget.getSize()[0], inputRenderTarget.getSize()[1],
                0, 0, outputRenderTarget.getSize()[0], outputRenderTarget.getSize()[1],
                gl.COLOR_BUFFER_BIT, gl.NEAREST);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            return;
        }
        this.shaderPass.render(gl, context, inputRenderTarget, outputRenderTarget);
    }

    isEnabled(): boolean { return this.shaderPass.getEffectEnabled(); }
}
```

- **`FinalBlitRendererFlow`**: 最終的にオフスクリーンのRT内容を`ScreenRenderTarget`（画面）へ描き出す専用フロー。

新規Flowを追加するときは、この3クラスのうちどれに近い性質か（シーン走査系／単一パスラップ系／画面出力系）をまず判断し、近いものを手本にする。

## `~Pipeline`ファミリーとの関係

`SceneRendererPipeline`（`pipeline.md`）が`RendererFlowOperation[]`を保持し、`render()`の中で順に呼び出すオーケストレーション役。`~Flow`自身は自分がパイプラインのどの段にいるかを意識しない疎結合設計。
