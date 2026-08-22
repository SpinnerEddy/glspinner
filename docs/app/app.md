# app — アプリケーションのライフサイクル基底クラス

## 概要

`src/app/`は、glspinnerを使ったアプリケーションの起動シーケンスとインフラ一式の生成を担う。`ApplicationOperation`インターフェース→`BaseApplication`（抽象）→`RecordingApplication`（抽象、録画機能を追加）という2段の中間抽象クラス構成が特徴で、最終的な具象クラスは`src/`内には存在せず、ライブラリ利用側（`examples/sample.ts`）が`setup`/`update`/`draw`を実装して初めて具体化する。

## 主要クラス一覧

| クラス/ファイル | 役割 | 備考 |
|---|---|---|
| `ApplicationOperation.ts` | 契約インターフェース | `start`/`preload`/`setup`/`update`/`draw`の5メソッド |
| `BaseApplication.ts` | 抽象基底、共通インフラの一括生成 | `setup`/`update`/`draw`のみ`abstract` |
| `RecordingApplication.ts` | 録画機能を追加する中間抽象クラス | `BaseApplication`を継承しつつ`abstract`のまま |

## アーキテクチャ・設計パターン

`BaseApplication`は「共通実装が濃いBase」型で、コンストラクタが`WebGLUtility`/`ShaderLoader`/`TextureLoader`/`TextFontLoader`/`RendererContext`/`SceneGraph`/`AudioOutput`/`SceneRendererPipeline`/`InputHub`という、アプリ全体で必要になるインフラをほぼ一括生成する。`start()`（起動シーケンス全体）と`preload()`（共通シェーダのロードと`MaterialFactory.init()`）は具体実装を持ち、`setup`/`update`/`draw`の3つだけが`abstract`として利用者側に残る。

```ts
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
        // ...ShaderLoader/TextureLoader/TextFontLoader/RendererContext/SceneGraph/AudioOutput/SceneRendererPipeline/InputHubを生成
        this.scene = scene; // Sceneは外部から注入で受け取る（自前ではnewしない）
    }

    public async start(): Promise<void> {
        await this.preload();
        this.setup();
        this.scene.setUpdate(this.update.bind(this));
        this.scene.setDraw(this.draw.bind(this));
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

コンストラクタが`SceneOperation`を外部から注入で受け取る点に注意——`BaseApplication`自身は`Scene`を`new`しない。呼び出し側が`const scene = new GLSpinner.Scene(); const app = new Sample(scene);`のように先に`Scene`インスタンスを作ってから`Application`へ渡す、という依存性注入的な組み立て順序になっている（`examples/sample.ts`末尾で実際にこの順序を確認できる）。

## 主要クラス詳細

### `RecordingApplication`（中間抽象クラス）

```ts
export abstract class RecordingApplication extends BaseApplication {
    protected recorder: Recorder;
    private isRecording: boolean;

    constructor(scene: RecordScene) {
        super(scene);
        this.recorder = new Recorder(this.canvas);
        this.isRecording = false;
        RecordGuiController.initialize(this.startRecording.bind(this), this.endRecording.bind(this), this.changeSceneClock.bind(this));
    }

    public async start(): Promise<void> {
        await this.preload();
        this.setup();
        this.scene.setUpdate(this.update.bind(this));
        this.scene.setDraw(this.draw.bind(this));
        this.scene.setAdditionalSupport(this.additionalSupport.bind(this)); // BaseApplication.start()との差分はこの1行のみ
        this.scene.start();
    }

    startRecording(): void { /* recorder.resetRecord() + setOptions() */ }
    endRecording(): void { /* type !== 'Frame' ならZIP保存 */ }
    changeSceneClock(clockType: ClockType): void { /* RealTime/Fixedを切り替え */ }

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

録画機能（`Recorder`・`RecordGuiController`、`docs/tools/tools.md`参照）を追加する拡張で、`setup`/`update`/`draw`を自身でも`abstract`のまま再宣言している。`start()`もオーバーライドし、`BaseApplication.start()`との差分は`this.scene.setAdditionalSupport(this.additionalSupport.bind(this))`が1行追加されているだけ——録画中の毎フレーム処理（`additionalSupport`フック）を`Scene`のループへ差し込む配線がこの1行に集約されている。コンストラクタの引数型が`SceneOperation`から`RecordScene`（具象型）へ狭められている点も、基底クラスからの緩やかな特殊化として観察できる。

`additionalSupport()`内には、録画終了を自動判定する行がコメントアウトされたまま残っている（`// if(this.recorder.endRecordingAuto()){ this.endRecording(); }`）。

### 利用者側の具象化パターン

`src/`内には最終的な具象`Application`クラスは存在しない。ライブラリ利用側（`examples/sample.ts`の`Sample extends GLSpinner.BaseApplication`）が`setup`/`update`/`draw`（必要なら`preload`もsuper呼び出しを挟んで拡張）を実装して初めて具体化する。

```ts
class Sample extends GLSpinner.BaseApplication {
    async preload(): Promise<void> { await super.preload(); /* 追加のシェーダ/テクスチャロード */ }
    setup(): void { /* RenderTargetRegistryへの登録、シーングラフ構築、Camera設定等 */ }
    update(): void { /* Transform更新、ライト収集、GlobalUniforms更新 */ }
    draw(): void { /* viewport設定、rendererFlowPipeline.render() */ }
}

const scene = new GLSpinner.Scene();
const sample = new Sample(scene);
await sample.start();
```

## 起動シーケンス（`preload → setup → Scene.start()`）

`preload`（非同期リソースロード）→`setup`（同期的な初期構築）→`Scene`へコールバック登録して`start()`、という順序がこのファミリー全体を貫く起動契約。`RecordingApplication`もこの骨格を保ったまま`setAdditionalSupport`の登録を1行差し込むだけに留めている。

## 他モジュールとの関係

- **`scene/core.md` (`Scene`/`RecordScene`)**: `Application`自身はクロックを持たず、コンストラクタで受け取った`SceneOperation`に時間管理を委譲する。`RecordingApplication.changeSceneClock()`が`scene.setRealTimeClock()`/`scene.setFixedTimeClock()`を呼び分ける。
- **`scene/factory.md` (`MaterialFactory`)**: `BaseApplication.preload()`が`MaterialFactory.init()`を呼ぶ唯一の箇所。
- **`input/input.md` (`InputHub`)**・**`scene/renderer.md` (`SceneRendererPipeline`/`RendererContext`)**: いずれも`BaseApplication`のコンストラクタで生成され、`protected`フィールドとして利用者側から参照される。
- **`tools/tools.md`**: `RecordingApplication`が`Recorder`（インスタンスクラス）と`RecordGuiController`（静的クラス）を組み合わせる、`app`ファミリーが`tools`ファミリーに依存する唯一の接続点。

## 既知の制約・未完成部分

`RecordingApplication`は物理的に`src/app/`（コア側公開エントリポイント`src/index.ts`）に残っているが、内部で`Recorder`/`RecordGuiController`（`lil-gui`/`jszip`依存）を直接importしている。`vite.config.ts`の`external`設定により`lil-gui`/`jszip`自体はコアのバンドルに含まれないが、import文としては残るため、`RecordingApplication`を使う場合は結局`lil-gui`/`jszip`が必要になる。
