# レンダリングパイプラインの Render Graph 化

**ステータス**: 提案（未実装）
**対象**: `src/scene/renderer/`（`pipeline/`, `flow/`, `postEffect/`, `context/`）, `src/webgl/gl/fbo/`, `src/app/BaseApplication.ts`, `examples/sample.ts`

## Context（なぜこの変更をするか）

現状、レンダリングの「グラフ構造」——どのパスが何を読み書きし、どういう順序で実行されるか——がコード上のどこにも明示されておらず、3箇所に暗黙的に分散している。

1. **アプリ側**（`examples/sample.ts`の`setup()`） — 使うRenderTargetを全て手で`new`して`RenderTargetRegistry`に事前登録する。解像度も決め打ち。しかも現在のsampleは最終ブリット（`addFinalBlitFlow`の呼び出し）がコメントアウトされていてRT経路自体が死んでいるため、`CustomRenderTarget`を6枚確保して1枚も使っていない。
2. **`RenderTargetRegistry`**（`.claude/rules/render-target.md`参照） — `RenderTargetSlot`をキーにした単なる`Map`プールで、どのパスが何を必要とするかを知らない。`BLOOM_RENDER_TARGET`のように定義だけあって未使用のスロットが残る。
3. **`SceneRendererPipeline.render()`**（`.claude/rules/pipeline.md`参照） — read/writeのping-pong swapがメソッド内にハードコードされ、実行順は`addPostEffectFlow`のpush順への暗黙依存。さらに「RTを使わない場合」が`renderSceneUnusedRenderTarget()`という専用分岐で特別扱いされている。

加えて`BloomShaderPass`（`.claude/rules/pass.md`が記録する唯一の`BaseShaderPass`非継承の例外クラス）は内部で`RenderTargetRegistry`から`BRIGHT_PASS_BUFFER`/`PINGPONG_TEMP_BUFFER`を直接取っており、パスの真のリソース要求が外から見えない。

これらは無関係な3つの不満ではなく、**「グラフ構造を宣言する場所が存在しない」という同一原因の症状**という捉え方をする。RenderTarget関連のコード変更相談から出発し、最終的にレンダリングパイプライン全体の設計に踏み込んだのはこのため。

### 目指す状態

各パス（`~Flow`/`~Pass`ファミリー相当）が自分の入出力を宣言し、コンパイラが宣言から物理RTの生成・共有・実行順を解決する。結果として:

- アプリ側の手動RT確保がゼロになる
- read/writeのping-pongはコンパイラの解析結果として自動的に導出される（手書きしない）
- **RTを一切使わない作品（描画宣言したものがそのまま画面に表示される）も特別扱いなしで動く** — 「中間リソースの宣言が0個だった」という解決結果として自動的に画面直結になる

最後の点は設計を詰める過程で追加された要件で、既存実装の`renderSceneUnusedRenderTarget()`分岐（`finalBlitFlow`が未設定のときのフォールバック）に相当する。この提案ではこれを特別なコードパスとしてではなく、コンパイラの解決ルールの一部として扱う（詳細は後述）。

## 決定事項（設計相談で合意済み）

| 論点 | 決定 | 理由の要約 |
|---|---|---|
| Graphの粒度 | Graph = 容器（具象1つ、Baseなし）、中身は`~GraphNode`ファミリー | `~Pipeline`ファミリーと同型（`operation-base.md`の小規模ファミリーパターン）。Graph自体を合成可能にすると「GrayScale1枚を包むだけのクラスもGraphと呼ぶ」ことになり名前と実体がずれる |
| `~Flow`ファミリー | 削除。3具象を`~GraphNode`へ1:1で作り替え | `RendererFlowOperation.render(gl, ctx, in, out)`はIOを外から与えられる契約そのもので、これを残すとグラフ構造を宣言する場所がアダプタの外に残ってしまう |
| `~Pass`ファミリー | 無傷（`BloomShaderPass`のみ例外） | `ShaderPassOperation.render(gl, ctx, inRT, outRT)`は「解決済みの物理RTを受け取って描く」層としてグラフ化後も成立する |
| Bloom | 1ノードのまま`setup()`で内部transientを宣言 | 複数パス合成の複合エフェクトという性質自体は変わらない。`setup()`を持てるようになった時点で内部リソースを宣言できるので、4ノードに分解する必要がない |
| リソース解決 | ライフタイム解析による自動エイリアス | 区間が重ならない宣言は同じ物理RTを共有できる。現状の決め打ちping-pongは、この解析の特殊ケース（線形チェーンで2枚に収束する場合）として自然に導出される |
| `~Pipeline` | 残してGraphを抱える。層はApplication → Pipeline → Graph → Node | `pipeline.md`の`addXxx`命名規約・`BaseApplication`の`rendererFlowPipeline`フィールドという既存の骨格を維持できる |
| compileの起点 | `BaseApplication.start()`に1行 + 状態変更時に再コンパイル。`render()`に分岐を置かない | 無効化されたパスは実行時にスキップするのではなくコンパイル時にグラフから除去する。これにより`PostEffectRendererFlow`の`blitFramebuffer`バイパスが不要になり、`render()`が`this.graph.execute(gl, context)`という分岐のない1行になる |

## 設計

### ディレクトリ構成

```
src/scene/renderer/graph/
    RenderGraphOperation.ts        interface
    RenderGraph.ts                 唯一の具象（~Pipelineと同じ「Operationあり/Baseなし」の形）
    RenderGraphBuilder.ts          宣言フェーズ
    RenderGraphCompiler.ts         解決フェーズ（gl非依存 = ユニットテスト可能）
    RenderGraphResources.ts        物理RTプール + ハンドル→実体の解決
    RenderResourceHandle.ts
    RenderTargetDescriptor.ts
    node/
        RenderGraphNodeOperation.ts
        BaseRenderGraphNode.ts
        SceneRenderGraphNode.ts
        PostEffectRenderGraphNode.ts
        FinalBlitRenderGraphNode.ts
        BloomRenderGraphNode.ts
```

### 記述子とハンドル

`RenderTargetDescriptor`は既存`src/webgl/gl/fbo/RenderTargetOption.ts`の`AttachmentConfig`をそのまま再利用する（新しい属性型を作らない）。

```ts
export type RenderTargetDescriptor = {
    scale?: number;                     // 画面相対（デフォルト1.0）。HALF_RES_BUFFERの決め打ちを置き換える
    size?: [number, number];            // 絶対指定（scaleと排他）
    attachments?: AttachmentConfig[];   // 既存型。省略時 [{ type: AttachmentType.COLOR }]
};
```

`RenderResourceHandle`は`getId()`/`getName()`を持つ値オブジェクト（`SceneNode.getId()`に合わせたメソッド形式。`.claude/rules/vector-matrix.md`のアクセサ形式ではなく、状態を持つ振る舞い側の流儀に合わせる）。

### `RenderGraphBuilderOperation`（宣言フェーズ）

チェーン用の語彙を用意することで、アプリ側でハンドルを手配線する必要をなくす。既存の`addXxx`で順に積む使い勝手（`pipeline.md`）を保つための要。

```ts
export interface RenderGraphBuilderOperation {
    readCurrentColor(): RenderResourceHandle;                                              // 直前の表示対象カラーを読む
    writeNewColor(name: string, descriptor: RenderTargetDescriptor): RenderResourceHandle; // 新しい表示対象カラーを書く
    readWriteCurrentColor(): RenderResourceHandle;                                         // 同一リソースへの上書き（OVERLAY合成用）
    createRenderTarget(name: string, descriptor: RenderTargetDescriptor): RenderResourceHandle; // ノード内部の中間リソース
    importRenderTarget(name: string, renderTarget: RenderTargetOperation): RenderResourceHandle; // 外部持ち込み（将来のPREV_FRAME等）
}
```

Builderは「今`setup`中のノード」を保持し、各呼び出しをread/writeとして記録する。

### `RenderGraphNodeOperation`（`~GraphNode`ファミリー）

```ts
export interface RenderGraphNodeOperation {
    setup(builder: RenderGraphBuilderOperation): void;
    execute(gl: WebGL2RenderingContext, context: RendererContext, resources: RenderGraphResourcesOperation): void;
    isEnabled(): boolean;
    getName(): string;
}
```

`BaseRenderGraphNode`は`name`/`isNodeEnabled`を保持し`isEnabled()`/`setEnabled()`/`getName()`を共通実装、`setup`/`execute`をabstractに残す（`BaseGeometry`程度の共通化密度）。

各具象の`setup()`:

```ts
// SceneRenderGraphNode（OPAQUE）— 深度アタッチメントを自分で宣言する
this.output = builder.writeNewColor(this.name, { scale: 1.0, attachments: [{ type: COLOR }, { type: DEPTH }] });

// SceneRenderGraphNode（OVERLAY）— 既存カラーの上に重ねる
this.output = builder.readWriteCurrentColor();

// PostEffectRenderGraphNode
this.input  = builder.readCurrentColor();
this.output = builder.writeNewColor(this.name, { scale: 1.0 });

// BloomRenderGraphNode
this.input  = builder.readCurrentColor();
this.bright = builder.createRenderTarget('bloom.bright', { scale: 1.0 });
this.blurA  = builder.createRenderTarget('bloom.blurA',  { scale: 0.5 });
this.blurB  = builder.createRenderTarget('bloom.blurB',  { scale: 0.5 });
this.output = builder.writeNewColor('bloom.out', { scale: 1.0 });
```

`execute()`は`resources.get(handle)`で物理RTを引き、既存`ShaderPassOperation.render(gl, context, inputRT, outputRT)`にそのまま渡す。**`~Pass`側のシグネチャは変更しない。**

`PostEffectRenderGraphNode.isEnabled()`は包んだ`ShaderPassOperation.getEffectEnabled()`へ委譲する。これで既存の`PostEffectGuiController`の配線が生き残る。

### `RenderGraphCompiler`（解決フェーズ）

**glに一切触れない純粋ロジックとして切り出す。** 入力は宣言レコード列、出力は「ハンドル→物理スロット番号」の割当表。`testEnvironment: 'node'`下でユニットテストできる唯一の新規ロジック。

解決ルール:

1. `isEnabled()`がfalseのノードを落とす（**無効パスはコンパイル時に消えるので、`PostEffectRendererFlow`の`blitFramebuffer`バイパスが不要になる**）
2. 残ったノードを宣言順に`setup()`して read/write レコードを集める
3. 最後の「表示対象カラー」ハンドルは物理RTを作らず、インポート済み`ScreenRenderTarget`（`framebuffer = null`）に束ねる
4. どこからも読まれず、かつ最終カラーでもないハンドルは確保しない（デッドリソース除去）
5. 残りはlifetime = [最初に書かれるindex, 最後に読まれるindex]を求め、区間が重ならず解決後の記述子（解像度+アタッチメント構成）が同一なものは同じ物理RTを共有する

ルール3の帰結として、「RTを使わない作品」を含む3ケースが同じルールから導かれる:

| アプリ側の宣言 | 確保されるFBO |
|---|---|
| シーンパスのみ（RT不使用の作品） | **0枚** — シーンパスが画面直結 |
| シーンパス + ポストエフェクト数段 | 解析結果に応じて2枚程度 |
| 上記 + 明示的な最終ブリット | 同上 |

`renderSceneUnusedRenderTarget()`の分岐は消える。また最後のポストエフェクトが直接画面に描けるため、`FinalBlitRenderGraphNode`は常設ではなく「明示的なトーンマップ／解像度変換をしたいときだけ足す1ノード」になる。

### `RenderGraphResources`

記述子をキーにした物理RTプールを保持し、再コンパイル時は同じ記述子のFBOを作り直さず再利用する。これによりGUIトグルのたびにFBOを再生成することがなくなる。

```ts
export interface RenderGraphResourcesOperation {
    get(handle: RenderResourceHandle): RenderTargetOperation;
}
```

### `RenderGraph`と`SceneRendererPipeline`

```ts
export interface RenderGraphOperation {
    addPass(node: RenderGraphNodeOperation): void;
    compile(gl: WebGL2RenderingContext, context: RendererContext): void;
    execute(gl: WebGL2RenderingContext, context: RendererContext): void;
    setPassEnabled(name: string, enabled: boolean): void;   // 内部で再コンパイル
    resize(resolution: [number, number]): void;             // 内部で再コンパイル
    dispose(): void;
}
```

`SceneRendererPipeline`は`RenderGraph`を1つ抱える薄い層になり、`render()`は分岐なしの1行（`this.graph.execute(gl, context)`）。登録メソッドは`addScenePass`/`addPostEffect`/`addFinalBlit`に改名する（`addXxx`命名規約は維持）。

`BaseApplication.start()`に1行差し込む（`RecordingApplication`が`setAdditionalSupport`を1行足しているのと同じ要領。`.claude/rules/application.md`の起動シーケンス契約を壊さない）:

```ts
await this.preload();
this.setup();
this.rendererPipeline.compile(this.gl, this.rendererContext);   // ← 追加
this.scene.setUpdate(this.update.bind(this));
this.scene.setDraw(this.draw.bind(this));
this.scene.start();
```

再コンパイルは`compile()`が呼ばれた時点でのみ発生し、`render()`側には判定を置かない。GUIからのトグルや画面リサイズなど、グラフのトポロジを変える操作自体が`setPassEnabled()`/`resize()`を通じて再コンパイルを引き起こす。

### RenderTagとの関係

`SceneRenderGraphNode`はコンストラクタで`RenderTag`（`.claude/rules/pipeline.md`参照）を受け取り、`execute()`冒頭で`context.setActivateRenderTag()`を呼ぶ。結果として**未配線のタグ（BACKGROUND/TRANSPARENT/DISTORTION/EMISSIVE）がノードを足すだけで使えるようになる** — `pipeline.md`が「新規パスを追加する際にはパイプライン側への配線追加が必要」と記録している制約が解消される。現状の`renderScene()`内のタグループは消え、タグ1つ=ノード1つになる。

## 変更対象ファイル

**新規** — `src/scene/renderer/graph/`配下12ファイル（上記ディレクトリ構成参照）

**書き換え**
- `src/scene/renderer/pipeline/SceneRendererPipeline.ts` — Graphを抱える形へ。`render()`からswapロジックと`renderSceneUnusedRenderTarget()`を削除
- `src/scene/renderer/pipeline/SceneRendererPipelineOperation.ts` — `compile()`追加、`addXxx`改名
- `src/scene/renderer/RendererContext.ts` — `renderTargetRegistry`フィールドと`getRenderTargetRegistry()`を削除
- `src/app/BaseApplication.ts` — `compile()`の1行追加、フィールド名`rendererFlowPipeline` → `rendererPipeline`（"Flow"が実体を失うため）
- `src/index.ts` — exportの入れ替え
- `examples/sample.ts` — RT手動確保15行を削除し、ノード登録に置き換え

**削除**
- `src/scene/renderer/flow/`一式（`RendererFlowOperation`/`BaseSceneRendererFlow`/具象3クラス）
- `src/scene/renderer/context/RenderTargetRegistry.ts`/`RenderTargetRegistryOperation.ts`
- `src/webgl/gl/fbo/RenderTargetConstants.ts`（`RenderTargetSlot`）
- `src/scene/renderer/postEffect/BloomShaderPass.ts` — 中身は`BloomRenderGraphNode`へ移る。`postEffect/`で削除されるのはこの1クラスのみで、他の`~ShaderPass`と`BaseShaderPass`は無傷

**要判断（削除候補）**
- `src/webgl/gl/fbo/PingPongRenderTarget.ts` — 自動エイリアスがping-pongを導出するため、ライブラリ内から参照されなくなる

**スコープ外**
- `PREV_FRAME`相当のフレーム跨ぎ永続リソース。`importRenderTarget()`で表現可能な設計にはしてあるが、今回は配線しない（現状も未使用）
- UBOのまとめ方（README記載の別課題）

## 実装順序

glに依存しない層から積み、各段で`npm run build`（tsc型チェック）を通す。

1. `RenderTargetDescriptor`/`RenderResourceHandle`/宣言レコード型
2. `RenderGraphCompiler` — 解決ロジック。**ここで`tests/scene/renderer/graph/RenderGraphCompilerTest.ts`を書く**
3. `RenderGraphResources`（物理RTプール）/`RenderGraphBuilder`/`RenderGraph`
4. `BaseRenderGraphNode` + 具象4つ
5. `SceneRendererPipeline`/`RendererContext`/`BaseApplication`/`src/index.ts`の接続
6. 旧クラス群の削除
7. `examples/sample.ts`の更新
8. `.claude/rules/`への反映（`glspinner-conventions`スキル） — `flow.md`廃止、`graph.md`新規、`pipeline.md`/`render-target.md`/`pass.md`/`application.md`改訂

## 検証方法

**ユニットテスト** — `RenderGraphCompiler`がgl非依存なので、以下を`tests/`で検証できる（既存の`XxxTest.ts`命名・相対import に合わせる）:
- 中間リソース宣言0個 → 物理RT0枚、最終カラーが画面に束ねられる
- 線形チェーン4段 → 物理RT2枚に収束する（ping-pongが導出されること）
- 無効ノードがチェーンから落ち、前後が繋ぎ直されること
- 読まれないリソースが確保されないこと
- 記述子が異なる（`scale: 0.5`等）リソースはエイリアスされないこと

**実機確認** — `npm run dev`（ポート2222）で:
1. 現状のsample（ポストエフェクトなし） — 立方体が今まで通り描画され、FBOが確保されていないこと
2. Bloom + 最終ブリットを有効化 — ブルームが乗ること
3. GUIからエフェクトをON/OFF — 再コンパイルが走り、チェーンが破綻しないこと

**既知の潜在バグの解消確認** — 現状`sample.ts`の`CustomRenderTarget`はオプション未指定で深度アタッチメントが無いのに、`StandardSceneRendererFlow`は`gl.clear(COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT)`を呼んでいる（RT経路が死んでいるため未露見）。`SceneRenderGraphNode`が深度を自分で宣言するようになるため、オフスクリーン経路を有効化しても深度テストが効くことを確認する。

## 実装分担についての注意

`.claude/CLAUDE.md`の編集範囲制限により、`src/`配下と`examples/`配下は原則ユーザー自身が実装する。この設計は新規アルゴリズム（ライフタイム解析・リソース解決）を含むため、「会話で完全に確定した機械的反映」の例外条件には該当しない。

Claude Code側が担当できるのは:
- `tests/`配下（`RenderGraphCompilerTest.ts`）
- `.claude/rules/`配下の規約反映（実装完了後、`glspinner-conventions`スキル経由）
- レビュー・設計相談（`glspinner-review`/`glspinner-design`スキル経由）

## この提案の経緯

`SceneRendererPipeline`・`RenderTargetRegistry`・`~Flow`ファミリーの現状分析から出発し、`glspinner-design`スキルでの設計相談を経て2026-08にまとめた。検討過程で以下の論点をユーザーと合意している:

- `~Flow`ファミリーをファサードで包む案は、IOを外から与えられる契約のままではBloomのような内部transientを持つパスを宣言できず、「RTを使わない作品」の特別扱いも解消しないため不採用とした
- Graphの粒度は「容器はGraph、中身はNode」とし、Bloomのような合成パスも1つのNodeとして扱う（Graphを合成可能にすると名前と実体がずれるため）
- コンパイルの引き金は`render()`内のdirty判定ではなく、`start()`時の1回 + トポロジ変更操作からの明示呼び出しとし、実行時分岐を増やさない
