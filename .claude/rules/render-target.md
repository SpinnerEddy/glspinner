# `~RenderTarget` ファミリー規約

`src/webgl/gl/fbo/`配下。**`BaseXxx`層が存在しない**（`RenderTargetOperation`インターフェースを各具象クラスが直接implementsする）上に、**具象クラスの1つ（`PingPongRenderTarget`）はインターフェースすら実装しない**という、`operation-base.md`の標準形から最も外れたファミリー。

## 構成

- `RenderTargetOperation`（インターフェース）
- `RenderTarget`（標準的な単一カラーテクスチャFBO。**`Base`接頭辞を持たないが具象クラス**、他ファミリーの`BaseXxx`に近い基本形という位置づけ）
- `CustomRenderTarget`（`AttachmentType`—COLOR/ID/NORMAL/EMISSIVE/DEPTH/DEPTH_TEXTURE/STENCIL/DEPTH_STENCIL—を任意組み合わせでアタッチできるMRT対応版。G-buffer的な用途を想定した拡張ポイントだが、現状のパイプラインでは未活用）
- `ScreenRenderTarget`（フレームバッファ`null`＝画面を表すダミー実装。テクスチャ取得系メソッドは例外を投げる）
- `PingPongRenderTarget`（**`RenderTargetOperation`を実装しない**。2枚の`RenderTargetOperation`を`read`/`write`として持ち`swap()`で入れ替えるラッパー。`getColorTexture`/`getDepthTexture`/`resize`/`dispose`など一部メソッドは同名で生えているが、インターフェースとしての契約はない）

## `RenderTargetOperation`

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

## 具象クラスの実装差

`RenderTarget`は7メソッド全てを実装するが、未対応の機能は例外を投げる形で表現する（`ScreenRenderTarget`も同様の方針）:

```ts
getDepthTexture(): WebGLTexture {
    throw new Error("Method not implemented.");
}
```

「未実装をthrowで明示する」というのはこのファミリーに限らず全体で見られる書き方だが、`~RenderTarget`ではFBOの構成（深度アタッチメントの有無など）によって一部メソッドが原理的に意味を持たないケースが多いため特に頻出する。新規のRenderTarget実装で対応しない機能がある場合はこのパターン（黙って`undefined`を返さず`throw`する）に合わせる。

## `PingPongRenderTarget`の等価比較

`PingPongRenderTarget`自体は等価比較をほぼ使わないが、同ファイル内の`RenderTarget.ts`は`===`/`!==`を使っている（`this.width === resolution[0] && this.height === resolution[1]`、`index !== 0`）。`general.md`「未解決・揺れがある事項」で触れたとおり、`==`/`!=`が多数派という初版の判断は`RenderTarget.ts`のような`===`/`!==`多用ファイルの存在で相対化されている。このファミリーのファイルを新たに触るときは`RenderTarget.ts`の書き方（`===`/`!==`）に合わせるのが自然。

## `~Buffer`/`~Pass`/`~Flow`との関係

`RenderTargetRegistry`（`src/scene/renderer/context/RenderTargetRegistry.ts`）が`RenderTargetSlot`（`CURRENT_FRAME`, `TEMP_FRAME_BUFFER`, `PREV_FRAME`, `HALF_RES_BUFFER`, `BRIGHT_PASS_BUFFER`, `BLOOM_RENDER_TARGET`, `PINGPONG_TEMP_BUFFER`）をキーにした`~RenderTarget`のプール（`Map`）を持つ。`~Pass`（`pass.md`）・`~Flow`（`flow.md`）・`~Pipeline`（`pipeline.md`）はいずれもこのプールからスロット指定で`RenderTargetOperation`を取り出して使う疎結合設計になっている。新規に永続的なRTが必要になった場合は、直接`new RenderTarget(...)`するのではなく`RenderTargetSlot`に新しいキーを追加して`RenderTargetRegistry`経由にするのが既存の一貫した運用。
