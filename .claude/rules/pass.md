# `~Pass`（ShaderPass）ファミリー規約

`src/scene/renderer/postEffect/`配下。`XxxOperation`+`BaseXxx`の標準形だが、**1クラスだけ`BaseXxx`を経由しない例外**がある。

## 構成

- `ShaderPassOperation`（インターフェース）
- `BaseShaderPass`（抽象基底）
- `BaseShaderPass`を継承する具象クラス9個: `GrayScaleShaderPass`, `MosaicShaderPass`, `RGBShiftShaderPass`, `GlitchShaderPass`, `BrightShaderPass`, `BlurShaderPass`/`SingleDirectionBlurShaderPass`, `ComposeShaderPass`, `MaskShaderPass`, `FinalBlitShaderPass`
- **例外**: `BloomShaderPass`は`ShaderPassOperation`を**直接**実装し、`BaseShaderPass`を継承しない（複数パス合成の複合エフェクトのため、単一の`material`+`plane`という`BaseShaderPass`の前提に収まらない）

## `BaseShaderPass`が提供する共通実装

```ts
export abstract class BaseShaderPass implements ShaderPassOperation {
    protected material: BaseMaterial;
    protected plane: MeshNode;
    protected isEffectEnabled: boolean = true;

    constructor(gl, material: BaseMaterial) {
        this.material = material;
        const planeGeometry = new Plane(gl, 2, 2);
        const planeAttributes = {
            aPosition: material.getAttribute(gl, 'aPosition'),
            aColor: material.getAttribute(gl, 'aColor'),
            aUv: material.getAttribute(gl, "aUv")
        };
        planeGeometry.setUpBuffers(gl, planeAttributes);
        const planeMesh = new UnlitMesh(planeGeometry, material);
        this.plane = new MeshNode(planeMesh);
    }

    abstract render(gl, context, inputRenderTarget, outputRenderTarget): void;

    setEffectEnabled(enabled: boolean): void { this.isEffectEnabled = enabled; }
    getEffectEnabled(): boolean { return this.isEffectEnabled; }

    protected draw(gl, context, outputRenderTarget): void {
        outputRenderTarget.bindAsDrawTarget();
        SceneGraphUtility.traverse(this.plane, (node) => node.draw(gl, context));
    }
}
```

コンストラクタで「フルスクリーンの`Plane`ジオメトリ + `UnlitMesh` + `MeshNode`」を組み立てるところまでを共通化し、`render()`だけを具象クラスの責務として`abstract`にしている。`setEffectEnabled`/`getEffectEnabled`（エフェクトON/OFF）と`protected draw()`（出力RTへのバインド＋プレーン描画）も共通実装。

## 具象クラスの実装パターン

```ts
export class GrayScaleShaderPass extends BaseShaderPass {
    constructor(gl, material: GrayScaleMaterial) { super(gl, material); }

    render(gl, context, inputRenderTarget, outputRenderTarget): void {
        const texture = inputRenderTarget.getColorTexture(0);
        gl.activeTexture(gl.TEXTURE0 + TextureSlot.CURRENT_FRAME);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        this.draw(gl, context, outputRenderTarget);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}
```

「入力RTのカラーテクスチャを取得 → テクスチャユニットにバインド → `this.draw()`を呼ぶ → アンバインド」という定型。新規ポストエフェクトを追加する際はまずこの定型をコピーし、対応する`~Material`（`material.md`のポストエフェクト用マテリアル群）を先に用意する。

## `BloomShaderPass`（例外）

```ts
input → BrightShaderPass(輝度抽出) → brightTempRT
brightTempRT → 横Blur → PingPong.write → swap → 縦Blur → PingPong.write
inputRT + PingPong(ブラー済みブルーム) → ComposeShaderPass → outputRT
```

内部で他の`~ShaderPass`（`BrightShaderPass`, `BlurShaderPass`×2, `ComposeShaderPass`）を保持して順に呼び出す複合エフェクト。`RenderTargetRegistry`から`BRIGHT_PASS_BUFFER`と`PINGPONG_TEMP_BUFFER`を取得して使い回す。`setEffectEnabled`は内部の4パス全てへ伝播させる実装になっている。**新規に複数パス合成のエフェクトを追加する場合はこの`BloomShaderPass`を手本にし、単一`BaseShaderPass`継承では表現できないことを確認してから`ShaderPassOperation`直接実装に切り替える**（安易に例外を増やさない）。

## `~Flow`ファミリーとの関係

`PostEffectRendererFlow`（`flow.md`）が`ShaderPassOperation`を1つラップし、`getEffectEnabled()`が false のときは`gl.blitFramebuffer`で入力をそのまま出力へコピーするバイパス機構を提供する。`~Pass`自身はこのバイパスを意識しない。
