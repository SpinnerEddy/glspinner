# `~Application` ファミリー規約

`src/app/`配下。`XxxOperation`+`BaseXxx`の標準形を踏襲するが、**中間の抽象クラスが1段ではなく2段（`BaseApplication`→`RecordingApplication`）になっている**点がこのファミリー最大の特徴。利用者側（`examples/sample.ts`の`Sample`など、`src/`の外）が最終的に`setup`/`update`/`draw`を実装して初めて具象化する。

## 構成

- `ApplicationOperation`（インターフェース、`src/app/ApplicationOperation.ts`）
- `BaseApplication`（抽象基底、`src/app/BaseApplication.ts`）
- `RecordingApplication`（`BaseApplication`を継承する**abstractのまま**の中間クラス、`src/app/RecordingApplication.ts`。録画機能を追加する）
- 利用者側の具象クラス（`src/`には存在せず、`examples/sample.ts`の`Sample extends GLSpinner.BaseApplication`のようにライブラリ利用側が最終的に実装する）

## `ApplicationOperation` / `BaseApplication`

```ts
export interface ApplicationOperation {
    start(): Promise<void>;
    preload(): Promise<void>;
    setup(): void;
    update(): void;
    draw(): void;
}

export abstract class BaseApplication implements ApplicationOperation {
    protected canvas: HTMLCanvasElement;
    protected webglUtility: WebGLUtility;
    protected gl: WebGL2RenderingContext;
    protected shaderLoader: ShaderLoader;
    protected textureLoader: TextureLoader;
    protected textFontLoader: TextFontLoader;
    protected scene: SceneOperation;
    protected sceneGraph: SceneGraph;
    protected rendererContext: RendererContext;
    protected audioOutput: AudioOutput;
    protected rendererFlowPipeline: SceneRendererPipelineOperation;
    protected inputHub: InputHub;

    constructor(scene: SceneOperation) {
        this.canvas = document.getElementById('webgl-canvas') as HTMLCanvasElement;
        this.webglUtility = new WebGLUtility(this.canvas);
        this.gl = this.webglUtility.getWebGL2RenderingContext();
        this.shaderLoader = new ShaderLoader(this.gl);
        this.textureLoader = new TextureLoader(this.gl);
        this.textFontLoader = new TextFontLoader(this.gl);
        this.scene = scene;
        this.rendererContext = new RendererContext(this.gl);
        this.sceneGraph = new SceneGraph();
        this.audioOutput = new AudioOutput();
        this.rendererFlowPipeline = new SceneRendererPipeline();
        this.inputHub = new InputHub();
    }

    public async start(): Promise<void> {
        await this.preload();
        this.setup();
        this.scene.setUpdate(this.update.bind(this));
        this.scene.setDraw(this.draw.bind(this))
        this.scene.start();
    }

    async preload(): Promise<void> {
        await this.shaderLoader.loadCommonShaders();
        MaterialFactory.init(this.shaderLoader, this.textureLoader, this.textFontLoader);
    }

    abstract setup(): void;
    abstract update(): void;
    abstract draw(): void;
}
```

`BaseApplication`は`~Device`や`~Buffer`のような「薄いBase」ではなく、`material.md`の`BaseMaterial`に近い「共通実装が濃いBase」型——コンストラクタで`WebGLUtility`/`ShaderLoader`/`TextureLoader`/`TextFontLoader`/`RendererContext`/`SceneGraph`/`AudioOutput`/`SceneRendererPipeline`/`InputHub`という、アプリ全体で必要になるほぼ全てのインフラを一括生成する。`start()`（`preload()` → `setup()` → `Scene.setUpdate/setDraw` → `Scene.start()`という起動シーケンス全体）と`preload()`（共通シェーダのロードと`MaterialFactory.init()`）は具体実装を持ち、`setup`/`update`/`draw`の3つだけが`abstract`として利用者側に残される。

**コンストラクタが`SceneOperation`を外部から注入で受け取る**点に注意（`this.scene = scene`のみで、`BaseApplication`自身は`Scene`を`new`しない）。呼び出し側（`examples/sample.ts`）が`const scene = new GLSpinner.Scene(); const sample = new Sample(scene);`のように先に`Scene`インスタンスを作ってから`Application`へ渡す、という依存性注入的な組み立て順序になっている。

## `RecordingApplication`（中間抽象クラス）

```ts
export abstract class RecordingApplication extends BaseApplication {
    protected recorder: Recorder;
    private isRecording: boolean;

    constructor(scene: RecordScene) {
        super(scene);
        this.recorder = new Recorder(this.canvas);
        this.isRecording = false;
        RecordGuiController.initialize(
            this.startRecording.bind(this),
            this.endRecording.bind(this),
            this.changeSceneClock.bind(this)
        );
    }

    public async start(): Promise<void> {
        await this.preload();
        this.setup();
        this.scene.setUpdate(this.update.bind(this));
        this.scene.setDraw(this.draw.bind(this));
        this.scene.setAdditionalSupport(this.additionalSupport.bind(this));
        this.scene.start();
    }

    // startRecording/endRecording/changeSceneClock: Recorder・RecordGuiControllerとの橋渡し

    async preload(): Promise<void> {
        await super.preload();
    }

    async additionalSupport(): Promise<void> {
        if (this.isRecording) {
            const frameCount = this.scene.getClock().getFrameCount();
            const name = `frame_${String(frameCount + 1).padStart(5, '0')}.png`;
            await this.recorder.saveFrameWithName(name);
        }
    }

    abstract setup(): void;
    abstract update(): void;
    abstract draw(): void;
}
```

`RecordingApplication`は録画機能（`Recorder`・`RecordGuiController`、`tools.md`参照）を追加する拡張だが、**`setup`/`update`/`draw`を自身でも`abstract`のまま再宣言している**（`BaseApplication`側の抽象宣言をそのまま繰り返す、TypeScriptでは省略可能だが明示的に書く形）。`start()`もオーバーライドし、`BaseApplication.start()`との差分は`this.scene.setAdditionalSupport(this.additionalSupport.bind(this))`が1行追加されているだけ——録画中の毎フレーム処理（`additionalSupport`フック）を`Scene`のループへ差し込む配線がこの1行に集約されている。コンストラクタの引数型が`SceneOperation`から`RecordScene`（具象型）へ狭められている点も、基底クラスからのシグネチャの緩やかな特殊化として観察できる。

`additionalSupport()`内には、録画終了を自動判定する行がコメントアウトされたまま残っている（`// if(this.recorder.endRecordingAuto()){ this.endRecording(); }`。`general.md`「無効化中のコードは削除せずコメントアウトで残す」運用の実例）。

### `RecordingApplication`の公開エントリポイント（物理配置とは別軸）

`lil-gui`/`jszip`が本番ビルド（`dist/spinnergl-lib.*.js`）に混入する問題への対応として、2026-07にライブラリの公開エントリポイントを`src/index.ts`（コア）と`src/tools.ts`（`GuiUtility`/`RecordGuiController`/`LightGuiController`/`AudioGuiController`/`PostEffectGuiController`/`PlaySceneGuiController`/`Recorder`をexport、`tools.md`参照）の2つに分割した。`RecordingApplication`もtools側への移動が検討されたが、**コア側`src/index.ts`に残す**判断になった。理由は、`RecordingApplication`が継承する`BaseApplication`のコンストラクタが`WebGLUtility`/`ShaderLoader`/`RendererContext`/`SceneGraph`/`SceneRendererPipeline`/`InputHub`等のコアフレームワーク一式を丸ごと抱えるため、`RecordingApplication`をtools側の独立ビルドに含めるとコアフレームワークのコードがコア・tools両方のビルド成果物に二重にバンドルされてしまうため（`tools.ts`へ移した7クラスは`color`/`math`の軽量な値型と`lil-gui`/`jszip`にしか依存せず、この問題が起きない）。

結果として`RecordingApplication.ts`は物理的に`src/app/`に残ったままで、`~Application`ファミリーのクラス構成（`BaseApplication`→`RecordingApplication`という2段中間抽象クラス）や振る舞いは変わっていない。変わったのは「どちらの公開エントリポイントからexportされるか」という一点のみ（**物理配置と公開エントリポイントは別軸**）。`RecordingApplication`自身は従来どおりコンストラクタで`Recorder`を直接`new`し`RecordGuiController.initialize()`を呼んでおり、tools層への実装上の依存自体は変わらず残っている——つまり`spinnergl-lib`（コア）から`RecordingApplication`をimportすると、`lil-gui`/`jszip`への外部参照（`vite.config.ts`の`external`設定によりコード自体はバンドルされず、`import`文として残るのみ）は引き続き辿られる。

## 利用者側の具象化パターン

`src/`内には最終的な具象`Application`クラスは存在しない。ライブラリ利用側（`examples/sample.ts`の`Sample extends GLSpinner.BaseApplication`）が`setup`/`update`/`draw`（および必要なら`preload`もsuper呼び出しを挟んで拡張）を実装して初めて具象化する、という他ファミリーには無い構造（`material.md`/`device.md`等はいずれも`src/`内で全ての具象クラスが完結する）。新規にアプリケーションエントリーポイントを作る場合も、`src/app/`配下に具象クラスを追加するのではなく、この利用者側実装パターン（`examples/`または実際のアプリケーションコード側）に倣う。

## `preload` → `setup` → `Scene.start()`という起動シーケンス

```ts
public async start(): Promise<void> {
    await this.preload();
    this.setup();
    this.scene.setUpdate(this.update.bind(this));
    this.scene.setDraw(this.draw.bind(this))
    this.scene.start();
}
```

`preload`（非同期リソースロード）→`setup`（同期的な初期構築）→`Scene`へコールバック登録して`start()`、という順序がこのファミリー全体を貫く起動契約。`RecordingApplication`もこの骨格を保ったまま`setAdditionalSupport`の登録を1行差し込むだけに留めている。新規に`BaseApplication`の派生（3段目の中間抽象クラスなど）を追加する場合も、この起動シーケンスの骨格を壊さないことが前提になる。

## 他ファミリーとの関係

- **`~Clock`/`Scene`系**（`clock.md`、`operation-base.md`「Scene系」）: `Application`自身はクロックを持たず、コンストラクタで受け取った`SceneOperation`（`Scene`または`RecordScene`）に時間管理を委譲する。`RecordingApplication.changeSceneClock()`が`scene.setRealTimeClock()`/`scene.setFixedTimeClock()`を呼び分けることで、録画時のクロック種別（リアルタイム/固定フレーム）を切り替える。
- **`MaterialFactory`**（`material.md`）: `BaseApplication.preload()`が`MaterialFactory.init()`を呼ぶ唯一の箇所。利用者側の`preload()`オーバーライドは`super.preload()`を呼んだ上で追加のシェーダ/テクスチャ/フォントロードを行うのが定型（`examples/sample.ts`参照）。
- **`InputHub`**（`device.md`）・**`SceneRendererPipeline`**（`pipeline.md`）・**`RendererContext`**（`pipeline.md`）: いずれも`BaseApplication`のコンストラクタで生成され、`protected`フィールドとして利用者側の`setup`/`update`/`draw`から参照される。
- **`tools.md`**: `RecordingApplication`が`Recorder`（インスタンスクラス）と`RecordGuiController`（静的クラス）を組み合わせる、`~Application`ファミリーが`tools.md`ファミリーに依存する唯一の接続点。この依存があるため`RecordingApplication`はコア側の公開エントリポイント（`src/index.ts`）に留まる（詳細は上記「`RecordingApplication`の公開エントリポイント」節）。

## 変更履歴

- 2026-07-25: `lil-gui`/`jszip`の本番ビルド混入対策としてライブラリの公開エントリポイントを`src/index.ts`/`src/tools.ts`に分割した際、`RecordingApplication`をコア側に残すと判断した経緯を「`RecordingApplication`の公開エントリポイント（物理配置とは別軸）」節へ追記。
