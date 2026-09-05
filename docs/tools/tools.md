# tools — 録画とlil-gui GUIデバッグツール

## 概要

`src/tools/`は、`Operation+Base`パターンとは全く異なる「静的クラス + `initialize(callbacks)`」という独自パターンを持つファミリー。フレームキャプチャを行う`Recorder`（唯一の通常インスタンスクラス）と、`lil-gui`の薄いラッパーである`GuiUtility`、各機能領域のGUIを構築する5つの`*GuiController`（すべて静的クラス）から成る。`lil-gui`/`jszip`に依存するため、公開エントリポイントはコア（`src/index.ts`）とは別の`src/tools.ts`に分離されている。

## 主要クラス一覧

| クラス/ファイル | 役割 | 備考 |
|---|---|---|
| `Recorder.ts` | フレームキャプチャの実処理 | 通常のインスタンスクラス |
| `gui/GuiUtility.ts` | `lil-gui`の薄いラッパー | 全メソッド`static`、フォルダのスタック管理 |
| `gui/RecordGuiController.ts` | 録画設定のGUI | `RecordType`/`ClockType`/fps/解像度等 |
| `gui/LightGuiController.ts` | ライティング調整のGUI | 環境光色・光源方向・視点方向 |
| `gui/AudioGuiController.ts` | 音声再生制御のGUI | Play/Stopボタンのみ |
| `gui/PostEffectGuiController.ts` | ポストエフェクトON/OFF切り替えのGUI | `Map<string, ShaderPassOperation>`を受け取り動的にトグルを生成 |
| `gui/PlaySceneGuiController.ts` | シーン再生制御のGUI | Play/Stopボタンのみ |

## アーキテクチャ・設計パターン

このファミリーは`operation-base.md`が定義する「差し替え可能性やDIを意図した設計」の対象外——「アプリに1つだけ存在するGUI/録画機能をどう組み立てるか」という別種の関心事に対する別パターン。

### `*GuiController`共通パターン: 静的クラス + `initialize(callbacks...)`

```ts
export class RecordGuiController {
    private static recordType: RecordType = 'SequencialFrames';
    private static onRecordStart: () => void;
    // ...状態はすべてstaticフィールド

    static initialize(onRecordStart, onRecordEnd, onChangeClockType) {
        this.onRecordStart = onRecordStart;
        // ...
        GuiUtility.initialize();
        GuiUtility.addFolder('Recording');
        GuiUtility.addElement({ recordType: 'SequencialFrames' }, 'recordType', (value) => { this.recordType = value; }, [...]);
        // ...
        GuiUtility.addAction(() => { this.onRecordStart?.(); }, 'StartRecord');
    }

    static get recordOptions(): RecordOptions { /* staticフィールドから組み立てて返す */ }
}
```

`initialize()`にアプリ側のコールバック関数群を渡すことでGUIとアプリロジックを橋渡しする、というのが全`*GuiController`に共通の呼び出し方。状態は静的フィールドに保持するため、アプリ全体で単一インスタンス前提のシングルトン的設計になっている。

### `GuiUtility`: フォルダのネスト管理

```ts
export class GuiUtility {
    private static guiArrays: Array<GUI> = [];

    static addFolder(folderName: string) {
        const gui = this.GUI; // 配列の末尾 = 現在のフォルダ
        const folder = gui.addFolder(folderName);
        this.guiArrays.push(folder);
    }

    static resetFolder() {
        if (this.guiArrays.length <= 1) return;
        this.guiArrays.pop();
    }

    private static get GUI(): GUI {
        if (this.guiArrays.length == 0) this.guiArrays.push(new GUI());
        return this.guiArrays.at(-1)!;
    }
}
```

`guiArrays`というスタックで「フォルダのネスト」を`addFolder`（push）/`resetFolder`（pop）の対で表現する独自の積み上げ方式。`addElement`/`addElementWithRange`/`addColorElement`/`addAction`はジェネリクス（`T extends SettingElement, K extends keyof T`）で型安全にGUIバインディングを提供する。`*GuiController`側は`addFolder`→複数の`addElement`系→`resetFolder`という順で呼ぶのが定型。

## 主要クラス詳細

### `Recorder`

```ts
export class Recorder {
    private canvas: HTMLCanvasElement;
    private options: RecordOptions | undefined;
    private frames: FrameData[] = [];
    private currentFrameCount: number;

    constructor(canvas) { this.canvas = canvas; this.currentFrameCount = 450; } // resetRecord()の0とは異なる初期値

    resetRecord(): void { this.frames = []; this.currentFrameCount = 0; }
    setOptions(options: RecordOptions): void { this.options = options; }
    async saveSequentialFrames(): Promise<void> { /* canvas.toBlob()して単発保存 or frames配列へpush */ }
    async saveFrameWithName(name: string): Promise<void> { /* canvas.toBlob()して即保存 */ }
    endRecordingAuto(): boolean { /* type/frameNumから終了判定 */ }
    async saveFramesAsZip(zipName = 'record.zip'): Promise<void> { /* JSZipで一括保存 */ }
}
```

`canvas.toBlob()`でPNGフレームを取得し、単一フレーム保存(`saveFrameWithName`)・連番フレームをJSZipでZIP一括保存(`saveFramesAsZip`)・録画中の毎フレーム保存(`saveSequentialFrames`)の3パターンをサポートする。`RecordType`は`'Frame' | 'SequencialFrames' | 'StartAndStop'`の3種。

コンストラクタで`currentFrameCount`を`450`に初期化している一方、`resetRecord()`では`0`にしている——この非対称な初期値はソース上そのまま存在する（`resetRecord()`を呼ばずに使い始めると450からカウントが始まる状態になる）。

### `LightGuiController`

`ambientColor`（16進カラー文字列）・`lightDirection`（X/Y/Z別々のスライダーで`-1.0〜1.0`）・`eyeDirection`（X/Y/Z別々のスライダーで`0.0〜20.0`）を調整するGUIを構築し、`lightOptions`ゲッターで`LightOptions`（`{ambientColor, lightDirection: Vector3, eyeDirection: Vector3}`）としてまとめて返す。この形は元々`GouraudMaterial`の旧コンストラクタ引数（`lightDirection`/`eyeDirection`/`ambientColor`）と対応させたものだったが、`GouraudMaterial`が`PhongMaterial`と同じ自己完結・複数光源方式（`LitMaterial`、`docs/scene/material.md`参照）に置き換わり該当引数が無くなったため、現状`LightOptions`を受け取る消費者が見当たらない（`examples/`内にも参照箇所なし）。孤立した状態になっている可能性がある——`glspinner-task-discovery`等で扱うべき既知のギャップとして下記に追記。

### `PostEffectGuiController`

他の`*GuiController`と異なり、初期化時に呼び出し側から`Map<string, ShaderPassOperation>`と`Map<string, boolean>`（有効/無効の初期状態）を受け取り、キーの数だけ動的にトグルスイッチを生成する——GUI構造自体が実行時のポストエフェクト構成に依存する点が他の固定構成の`*GuiController`と異なる。

## 他モジュールとの関係

- **`app/app.md` (`RecordingApplication`)**: `Recorder`と`RecordGuiController`を組み合わせる唯一の接続点。
- **`scene/renderer.md` (`ShaderPassOperation`)**: `PostEffectGuiController`が型として参照する。
- **公開エントリポイント**: `lil-gui`/`jszip`への依存があるため、これらのクラスはコア（`src/index.ts`）ではなく`src/tools.ts`からexportされる（`vite.tools.config.ts`で別ビルド）。

## 既知の制約・未完成部分

- `Recorder`のコンストラクタ初期値(450)と`resetRecord()`の初期値(0)の食い違いは、意図的な初期値なのかバグなのか確認が取れていない差異として存在する。
- `LightGuiController.lightOptions`（`LightOptions`型）は、対応していた`GouraudMaterial`の旧コンストラクタ引数が`LitMaterial`導入（2026-09）で無くなったため、現状呼び出し元が見当たらない孤立コードになっている可能性がある（上記「`LightGuiController`」節参照）。
