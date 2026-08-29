# Canvasサイズを変更する際に触るべき箇所が分散している問題

**ステータス**: 提案（未実装）
**対象**: `examples/index.html`, `examples/sample.ts`, `src/app/BaseApplication.ts`, `src/scene/camera/Camera.ts`

## Context（なぜこの変更をするか）

4Kモニター（`devicePixelRatio !== 1`）で`examples/index.html`のCanvas表示が壊れるバグを調査・修正した過程で、副作用として「Canvasサイズ（現状800×800）を変更したいとき、修正箇所が複数に分散している」という技術課題が見つかった。

### 元バグの真因（前提として記録）

`examples/index.html`のCanvas要素にCSSでの`width`/`height`指定が無かったため、`WebGLUtility.resizeCanvasToDisplaySize()`（`src/webgl/gl/WebGLUtility.ts:20-33`）が`canvas.width`属性（描画バッファ解像度）を書き換えるたびに、CSS表示サイズ（`clientWidth`）自体も連動して変わってしまっていた。

```ts
const displayWidth = Math.floor(canvas.clientWidth * dpr);
...
canvas.width = displayWidth;
```

`devicePixelRatio === 1`（1920×1080/100%スケーリング）では`800 * 1 === 800`で変化がなく安定していたが、`devicePixelRatio !== 1`（4K/150%や200%スケーリング）では毎フレーム`clientWidth`が膨らみ続けるフィードバックループが発生し、実機を模した検証（`devicePixelRatio`を2に偽装してコールドスタートを再現）では**51200×51200まで暴走**することを確認した。

修正として`examples/index.html`のCanvas CSSに`width: 800px; height: 800px;`を追加し、表示サイズと描画バッファ解像度を分離した（同じ検証手順で暴走が止まることを確認済み）。

### この修正で生まれた副作用: サイズに関する箇所の重複

現状、Canvasサイズ（800）に関係する数値は3箇所に分散している。

```
examples/index.html:10-11   CSS      width: 800px; height: 800px;
examples/index.html:40      HTML属性  <canvas width="800" height="800">
src/scene/camera/Camera.ts:31-32   viewportWidth/viewportHeight のデフォルト値 800
```

| # | 場所 | 役割 | 今変えないと何が起きるか |
|---|---|---|---|
| 1 | `examples/index.html` HTML属性 | JS実行前の初期値・フォールバック | `resizeCanvasToDisplaySize()`が読み込み直後に上書きするため厳密一致は必須ではないが、ズレていると一瞬だけ違うサイズがチラつく |
| 2 | `examples/index.html` CSS | **実際の表示サイズを決める本体**（今回のバグ修正で追加） | ここを変えずにHTML属性だけ変えると、CSSと属性がズレて暴走バグが再発する |
| 3 | `src/scene/camera/Camera.ts`のデフォルト値 | `CameraOptions`省略時のアスペクト比計算の元になる | 正方形→正方形の変更なら影響しない（アスペクト比1:1のまま）。**非正方形**（例: 1280×720）に変える場合はここも合わせないとアスペクト比が狂う |

### 副次的に見つかったギャップ: カメラのcold startアスペクト比補正が効かない

さらに、非正方形へ変更する場合に絡む形で、既存のバグ修正（RenderTarget群をCanvasリサイズに追従させる修正）の隙間も見つかっている。

- `examples/sample.ts`の`draw()`は`this.webglUtility.setViewport(this.canvas)`が`true`（＝`needResize`）を返したときだけ`this.rendererContext.resize(...)`を呼ぶ。
- `src/app/BaseApplication.ts`の`start()`は`setup()`の直前に一度`resizeCanvasToDisplaySize()`を呼ぶよう修正済み。これにより`setup()`の時点で`canvas.width`は既に正しいDPR考慮後のサイズになっている。
- 結果として、**初回`draw()`の時点では既にサイズが一致しており`needResize`が`false`になるため、`rendererContext.resize()`は一度も呼ばれない**。
- `examples/sample.ts`は`new GLSpinner.Camera(GLSpinner.CameraType.Perspective)`と`CameraOptions`を渡さずに`Camera`を生成しているため、`Camera`は`viewportWidth`/`viewportHeight`ともにコンストラクタのデフォルト値800のまま起動する。
- 正方形のままなら実害はない（アスペクト比1:1はどのサイズでも変わらない）が、非正方形キャンバスにするとカメラのアスペクト比だけ古いデフォルト値を引きずり、映像が歪む。

## 決定事項（会話で合意済み）

方向性は決定した。下記「対応方針の候補」（案A〜D）はいずれも単独では採用せず、p5.jsの`createCanvas()`やProcessingの`size()`のように**`setup()`内で1箇所呼べば、CSS表示サイズ・描画バッファ解像度（DPR対応）・全RenderTarget・カメラのアスペクト比・`GlobalUniforms`の`RESOLUTION`が一括で正しく設定される統一API**（`BaseApplication.setCanvasSize(width, height)`）を新設する方針で合意した。詳細設計は下記「採用する設計」節を参照。実装そのものはまだ行っていない（未実装のまま）。

案B（`CameraOptions`を明示的に渡す）・案C（`BaseApplication.start()`での無条件`resize()`）の要素はこの統一APIの内部設計に統合される形で採用し、案D（HTML属性とCSSの重複解消）は「CSSは`setCanvasSize()`が実行時に設定するため不要になる」という形で結果的に解消される。案Aは不採用。

## 採用する設計: 統一API（`setCanvasSize`）

### 真因の再確認（この設計に直結する）

暴走バグの真因は`WebGLUtility.resizeCanvasToDisplaySize()`自体にある。CanvasにCSSでの`width`/`height`指定が無いと、`canvas.width`属性（描画バッファ解像度）を書き換えるたびにCSS表示サイズ（`clientWidth`）も連動して変わり、`devicePixelRatio !== 1`環境でフィードバックループが起きる。現状の応急修正（`examples/index.html`へのCSS追加）は、**この関数自体は今も無防備**なままの対症療法——CSS指定を忘れた別のCanvasやアプリでは再発しうる。今回の設計では、統一APIを積む前に、まずこの低レベル関数自体を自己防衛化する。

安全性の担保方式は「`WebGLUtility`自体を自己防衛化する」か「`setCanvasSize()`を呼ぶ規約のみに頼る」かで分かれたため、前者（自己防衛化）を採用した——将来`glspinner`を使う別のアプリ・別のCanvasでも同じ暴走バグを構造的に起こしえなくするため。

### 1. `WebGLUtility.resizeCanvasToDisplaySize()` を自己防衛化する

`src/webgl/gl/WebGLUtility.ts`

```ts
public resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): boolean {
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.clientWidth;
    const cssHeight = canvas.clientHeight;
    const displayWidth = Math.floor(cssWidth * dpr);
    const displayHeight = Math.floor(cssHeight * dpr);

    const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;

    if (needResize) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        // canvas.width/height属性の書き換えがCSS表示サイズにも連動してしまう（CSSでwidth/heightを
        // 指定していない場合の既定挙動）ため、直前に読んだCSSサイズを明示的に固定し直す。
        // これが無いとdevicePixelRatio!=1の環境でclientWidthが毎フレーム膨張し続ける。
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;
    }

    return needResize;
}
```

この時点で「CSSを一切書かなくても暴走しない」状態になる（`examples/index.html`に追加したCSSは以後なくても安全。残しても実害はない）。

### 2. `WebGLUtility` に明示的なサイズ指定口を追加

```ts
public setCanvasDisplaySize(canvas: HTMLCanvasElement, width: number, height: number): boolean {
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    return this.resizeCanvasToDisplaySize(canvas);
}
```

「現在のCSSサイズを維持しつつDPRだけ追従する」（既存の`resizeCanvasToDisplaySize`/`setViewport`、フレーム毎の呼び出し）と、「CSSサイズ自体を指定のサイズへ変える」（今回追加する`setCanvasDisplaySize`、明示的な呼び出し）を分離する。低レベルAPIは`WebGLUtility`に閉じ、`canvas`/`gl`より上のレイヤーへ薄く公開する。

### 3. `BaseApplication.setCanvasSize()` — 統一API本体

`src/app/BaseApplication.ts`

```ts
protected setCanvasSize(width: number, height: number): void {
    this.webglUtility.setCanvasDisplaySize(this.canvas, width, height);
    this.rendererContext.resize([this.gl.drawingBufferWidth, this.gl.drawingBufferHeight]);
}
```

`protected`にして`RecordingApplication`にもそのまま継承させる（オーバーライド不要）。利用者側（`examples/sample.ts`）は`setup()`の最初の行で呼ぶ:

```ts
setup(): void {
    this.setCanvasSize(800, 800);
    // ...この後のRenderTarget生成・Camera生成は、今までどおりgl.drawingBufferWidth/Heightを読むだけでよい
}
```

既存の`RendererContext.resize()`が「registryの`resizeAll` + `RESOLUTION`更新 + カメラ登録済みならアスペクト比更新」を既に1箇所でやっているため、`setCanvasSize()`はそれをそのまま呼ぶだけで済む。これがp5.jsの`createCanvas()`相当（呼んだ瞬間に表示サイズ・描画解像度・関連状態が揃う）になる。

### 4. `RendererContext.setCamera()` でカメラ登録時にも同期する（cold startギャップを閉じる）

`src/scene/renderer/RendererContext.ts`

現状の`resize()`は「今カメラが登録されていれば」アスペクト比を更新する。しかし`setup()`の典型的な書き方では`setCanvasSize()`（＝`resize()`呼び出し）が先、`Camera`の生成・`setCamera()`はそのあと、という順序になる。このままだと新しく登録される`Camera`は`Camera.ts`のデフォルト値（800/800）のままになり、非正方形サイズにしたときにアスペクト比が狂う（上記「副次的に見つかったギャップ」節そのもの）。

`resize()`が最後に呼ばれた解像度を保持し、`setCamera()`側でも同期することで、呼び出し順序に依存しないようにする。

```ts
private camera: Camera | undefined = undefined;
private lastResolution: [number, number] | undefined = undefined;

public resize(resolution: [number, number]): void {
    if (resolution[0] <= 0 || resolution[1] <= 0) return;

    this.lastResolution = resolution;
    this.renderTargetRegistry.resizeAll(resolution);
    this.globalUniformBuffer.updateUniformValue(GlobalUniformKey.RESOLUTION, new ShaderUniformValue(new Vector2(resolution[0], resolution[1])));
    if (this.camera !== undefined) {
        this.camera.setViewport(resolution[0], resolution[1]);
    }
}

public setCamera(camera: Camera): void {
    this.camera = camera;
    if (this.lastResolution !== undefined) {
        camera.setViewport(this.lastResolution[0], this.lastResolution[1]);
    }
}
```

これで「`setCanvasSize()`→`Camera`生成→`setCamera()`」の順でも、「`Camera`生成→`setCamera()`→（あとから）`setCanvasSize()`」の順でも、常に正しいアスペクト比になる。`Camera.ts`のデフォルト値800/800は「一度も`resize`/`setCanvasSize`が呼ばれなかった場合の保険」としてそのまま残してよく、変更不要。

### 5. 起動シーケンスの整理

`src/app/BaseApplication.ts` / `src/app/RecordingApplication.ts`

`setCanvasSize()`が`setup()`の最初の行で呼ばれる契約になるため、`start()`内の事前`resizeCanvasToDisplaySize()`呼び出し（RenderTarget追従修正の際に追加したもの）は役目を終える。二重の仕組みを残すと「どちらがサイズを決めているか」が読み手にとって曖昧になるため、`start()`からは削除し、`setup()`内`setCanvasSize()`呼び出しへ一本化する。

```ts
public async start(): Promise<void> {
    await this.preload();
    this.setup();   // ← setup()の最初の行でthis.setCanvasSize(...)を呼ぶのが契約
    this.scene.setUpdate(this.update.bind(this));
    this.scene.setDraw(this.draw.bind(this));
    this.scene.start();
}
```

`WebGLUtility.resizeCanvasToDisplaySize()`が自己防衛化されているため（設計1）、万一`setCanvasSize()`の呼び忘れがあっても暴走はしない（悪くとも「CSSの現状サイズがそのまま描画解像度になる」という今まで通りの単発の挙動に留まる）。

### 6. `examples/`側の反映

- `examples/sample.ts`の`setup()`冒頭に`this.setCanvasSize(800, 800);`を追加。
- `examples/index.html`のCanvas CSS（前回の応急修正で追加した`width: 800px; height: 800px;`）は、`setCanvasSize()`が起動時に同じ値を明示的に設定するため機能的には不要になる。削除して「サイズを変えたければ`sample.ts`の`setCanvasSize(...)`の引数を変えるだけでよい」という状態にする（HTML属性`width="800" height="800"`は、JS実行前の一瞬のペイントのためのフォールバックとして残すが、`setCanvasSize()`が即座に上書きするので値が多少ズレていても実害はない）。
- `draw()`内の毎フレームの`setViewport()`→`resize()`呼び出しは変更不要（ライブリサイズ、例えばブラウザウィンドウを別DPIのモニターへ移動した場合の追従に引き続き必要）。

この設計により、「Canvasサイズを変える」という操作は`examples/sample.ts`の`this.setCanvasSize(800, 800)`の引数を書き換えるだけになる。`examples/index.html`のHTML属性は実害のないフォールバックとして残るが値を厳密に合わせる必要はなくなり、`Camera.ts`のデフォルト値も`setCanvasSize()`/`setCamera()`の同期によって実質関与しなくなる。

## 対応方針の候補（検討の記録として残す）

以下は統一API方針に決まる前に比較検討した候補。不採用だが、検討過程の記録として残す。

### 案A: 何もしない（重複を許容し、コメントで注意喚起するだけ）

- **内容**: 3箇所の重複を解消せず、`examples/index.html`のCSSと属性が隣接した行にあることに頼る。必要なら「Canvasサイズを変える場合はここも確認」という一言コメントを添える程度に留める。
- **長所**: 変更コストゼロ。`examples/`はサンドボックスであり、頻繁にサイズを変える運用ではないなら過剰対応になりうる。
- **短所**: 気づかずCSSだけ/属性だけを変えると暴走バグが静かに再発する。非正方形化のアスペクト比ギャップも残ったまま。

### 案B: `examples/sample.ts`側で`CameraOptions`に明示的に`viewportWidth`/`viewportHeight`を渡す

```ts
this.camera = new GLSpinner.Camera(GLSpinner.CameraType.Perspective, {
    viewportWidth: this.gl.drawingBufferWidth,
    viewportHeight: this.gl.drawingBufferHeight
});
```

- **内容**: `Camera`生成時点（`setup()`内、既に`resizeCanvasToDisplaySize()`実行後）の`gl.drawingBufferWidth/Height`を明示的に渡す。`Camera.ts`側のデフォルト値800はフォールバックとしてそのまま残す。
- **長所**: 3番の「cold startでアスペクト比が古いデフォルトのまま」という問題を`examples/`側だけの変更で解消できる。`src/`（ライブラリ本体）に触れない。
- **短所**: HTML属性とCSSの重複（1番・2番）は未解決のまま。「サイズを変えるならCameraにも渡す」という規約をコード上のコメント等で明示しないと再度忘れられうる。

### 案C: `BaseApplication.start()`の初回リサイズでも`rendererContext.resize()`を無条件に呼び、cold startギャップ自体を閉じる

```ts
public async start(): Promise<void> {
    await this.preload();
    this.webglUtility.resizeCanvasToDisplaySize(this.canvas);
    this.setup();
    this.rendererContext.resize([this.gl.drawingBufferWidth, this.gl.drawingBufferHeight]); // 追加
    this.scene.setUpdate(this.update.bind(this));
    ...
}
```

- **内容**: `setup()`直後（`Camera`が`setCamera()`で登録された後）に、`needResize`の判定に関わらず一度`resize()`を強制的に呼び、`Camera`のアスペクト比と`GlobalUniforms`の`RESOLUTION`を必ず実際のCanvasサイズへ同期させる。
- **長所**: `examples/sample.ts`側の対応漏れに依存しない。`RecordingApplication.start()`（同様に`setup()`前リサイズを持つ）にも同じ1行を足せば、ライブラリを使う全アプリで自動的にこのギャップが閉じる。案Bと併用しても害はない（`Camera`側で既に正しい値を渡していれば`resize()`は同じ値を上書きするだけ）。
- **短所**: `src/app/BaseApplication.ts`・`src/app/RecordingApplication.ts`という**ライブラリ本体**（`src/`配下）への変更になるため、`.claude/CLAUDE.md`の編集範囲制限に従い原則ユーザー自身の実装になる。HTML属性とCSSの重複（1番・2番）は引き続き未解決。

### 案D: HTML属性とCSSの重複を1箇所に統合する

- **内容案1**: HTML属性の`width`/`height`を削除し、CSSの`width: 800px; height: 800px;`だけを残す。Canvasのデフォルト解像度（属性省略時は300×150）に一時的になるが、`BaseApplication.start()`の`resizeCanvasToDisplaySize()`が即座に上書きするため実害は起動直後の一瞬のみ。
- **内容案2**: 逆にCSS側を削除し、起動時にJSで`canvas.style.width = canvas.width + 'px'`のように属性からCSSへ一度だけ同期するコードを`examples/index.html`のインラインスクリプトに足す。ただし、この同期処理自体がCanvasリサイズの度に再実行されると元の暴走バグの構造に逆戻りするため、**一度きり**（DOMContentLoaded相当のタイミングで1回だけ）であることの保証が必要で、案1よりも慎重な実装が要る。
- **長所**: 数値の重複が構造的に1箇所になり、今後サイズを変える際に見落としが起きにくくなる。
- **短所**: 内容案1は「起動直後の一瞬だけ違うサイズが見える」という体験上のトレードオフがある（現状は無視できる程度と考えられるが要目視確認）。内容案2は前述の暴走バグを再導入しないための実装上の注意点が増え、`examples/`というサンドボックスの規模に対してやや過剰。

## 変更対象ファイル

| ファイル | 変更内容 |
| --- | --- |
| `src/webgl/gl/WebGLUtility.ts` | `resizeCanvasToDisplaySize()`の自己防衛化、`setCanvasDisplaySize()`追加 |
| `src/scene/renderer/RendererContext.ts` | `lastResolution`保持、`setCamera()`でのアスペクト比同期 |
| `src/app/BaseApplication.ts` | `setCanvasSize()`追加、`start()`から事前リサイズ呼び出しを削除 |
| `src/app/RecordingApplication.ts` | `start()`から事前リサイズ呼び出しを削除（`setCanvasSize()`は`BaseApplication`から継承） |
| `examples/sample.ts` | `setup()`冒頭に`this.setCanvasSize(800, 800);`を追加 |
| `examples/index.html` | Canvas CSSの`width`/`height`指定を削除（機能的に不要になるため） |

## 実装分担についての注意

`.claude/CLAUDE.md`の編集範囲制限により、`src/`配下（`WebGLUtility.ts`/`RendererContext.ts`/`BaseApplication.ts`/`RecordingApplication.ts`）は原則ユーザー自身の実装になる。`examples/`配下（`sample.ts`/`index.html`）も同様の制限対象だが、「新規の設計判断を伴わず、会話内で内容が完全に確定していて、ユーザーが直接同意している」場合はClaude Codeが直接編集してよい例外に該当しうる（実際、今回の暴走バグ本体の応急修正＝`examples/index.html`へのCSS追加は、この条件を満たしたためClaude Codeが直接編集した）。今回の統一API実装時も同様に、内容確定＋明示同意を経てから着手する。

## `.claude/rules/`への反映（実装後）

実装が完了しコードとして実在するパターンになった時点で、`glspinner-conventions`経由で以下を反映する:
- `.claude/rules/application.md`「`preload` → `setup` → `Scene.start()`という起動シーケンス」節に「`setup()`の最初の行で`this.setCanvasSize(width, height)`を呼ぶ」という契約を追記。
- `.claude/rules/pipeline.md`「`RendererContext`（フレーム単位の共有状態）」節に、`setCamera()`が最後の`resize()`解像度でアスペクト比を同期する挙動を追記。

## 検証方法

1. `npx tsc --noEmit` / `npm run lint`が通ること。
2. `devicePixelRatio`を2に偽装した状態でのコールドスタート再現（前回と同じ手法）で、CSSを`examples/index.html`から完全に削除した状態でも暴走しないこと（自己防衛化の検証）。
3. `examples/sample.ts`の`setCanvasSize(800, 800)`を一時的に`setCanvasSize(1280, 720)`のような非正方形へ変えて、`Camera.ts`側を一切触らずにアスペクト比が正しく（歪まずに）描画されること（cold startギャップが閉じたことの検証）。
4. 1920×1080/DPR=1でのリグレッション確認（前回同様）。
5. `npm test`（既存math/colorテストへの影響なし）。

## この提案の経緯

4Kモニターでの表示崩れバグ調査（`devicePixelRatio`偽装によるコールドスタート再現テストで、暴走の実測値51200×51200を確認）→ 原因特定 → `examples/index.html`へのCSS追加による応急修正、という一連の対応の中で、ユーザーから「今後Canvasサイズを800×800から変える場合、修正箇所が増えるか」という質問を受けたことがきっかけ。その場で3箇所の重複とcold startのアスペクト比ギャップを洗い出し、比較検討（案A〜D）をこのドキュメントに残した。

その後ユーザーから「p5.jsの`createCanvas()`やProcessingの`size()`のように、`setup()`で1箇所呼べば全部対応するのが理想」という具体的な方向性の要望が出たため、`glspinner-design`スキルで改めて設計を検討。安全性の担保方式（`WebGLUtility`自体の自己防衛化 vs. `setCanvasSize()`を呼ぶ規約のみへの依存）をユーザーに選んでもらい、前者を採用して上記「採用する設計」節としてまとめた。

## 変更履歴

- 初版時点では対応方針（案A〜D）が未決定のまま、比較検討のみを記録していた。
- その後、p5.js/Processing風の統一API（`BaseApplication.setCanvasSize()`）を新設する方針で合意し、「採用する設計」節を追加。案B・Cの要素はこの統一APIの内部設計に統合し、案Dは`setCanvasSize()`がCSSを実行時に設定することで結果的に解消される形になったため、それぞれ独立案としては不採用とした。案A〜Dの比較検討自体は経緯の記録として残す。実装はまだ行っていない。
