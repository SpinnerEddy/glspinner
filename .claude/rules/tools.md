# `Recorder` / `GuiUtility` / `*GuiController` ファミリー規約

`src/tools/`配下。`Operation`+`Base`パターンとは全く異なる、**静的クラス + `initialize()`** という独自パターンを持つファミリー。ユーザーの列挙例には含まれていないが、`*GuiController`という明確な接尾辞を共有する具象クラス5個があるため独立ファイルとして扱う。

## 構成

- `Recorder`（`src/tools/Recorder.ts`）: フレームキャプチャの実処理。通常のインスタンスクラス。
- `GuiUtility`（`src/tools/gui/GuiUtility.ts`）: `lil-gui`の薄いラッパー。**全メソッドが`static`**。
- `*GuiController`（`RecordGuiController`, `LightGuiController`, `AudioGuiController`, `PostEffectGuiController`, `PlaySceneGuiController`）: 各機能領域のGUI構築とアプリ側コールバックの橋渡し役。**全て静的クラス**。

## `*GuiController`の共通パターン: 静的クラス + `initialize(callbacks...)`

```ts
export class RecordGuiController {
    private static recordType: RecordType = 'SequencialFrames';
    private static onRecordStart: () => void;
    // ...状態は全て static フィールド

    static initialize(
        onRecordStart: () => void,
        onRecordEnd: () => void,
        onChangeClockType: (clockType: ClockType) => void
    ) {
        this.onRecordStart = onRecordStart;
        // ...
        GuiUtility.initialize();
        GuiUtility.addFolder("Recording");
        GuiUtility.addElement({recordType: 'SequencialFrames'}, "recordType", (value) => { this.recordType = value; }, [...]);
        // ...
        GuiUtility.addAction(() => { this.onRecordStart?.(); }, "StartRecord");
    }

    static get recordOptions(): RecordOptions { /* static フィールドから組み立てて返す */ }
}
```

`initialize()`にアプリ側のコールバック関数群を渡すことでGUIとアプリロジックを橋渡しする、というのが全`*GuiController`に共通の呼び出し方。状態は静的フィールドに保持するため**アプリ全体で単一インスタンス前提のシングルトン的設計**（`Operation`+`Base`パターンのようなインスタンス単位の差し替え可能性は最初から意図されていない）。新規に`*GuiController`を追加する場合もこのパターン（静的フィールド + `static initialize(callbacks)` + `GuiUtility`経由でのGUI要素追加）をそのまま踏襲する。

## `GuiUtility`: フォルダのネスト管理

```ts
export class GuiUtility {
    private static guiArrays: Array<GUI> = [];

    static addFolder(folderName: string) {
        const gui = this.GUI;              // 配列の末尾 = 現在のフォルダ
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

`guiArrays`というスタックで「フォルダのネスト」を`addFolder`/`resetFolder`の対で表現する独自の積み上げ方式（`addFolder`でpush、`resetFolder`でpop）。`addElement`/`addElementWithRange`/`addColorElement`/`addAction`はジェネリクス（`T extends SettingElement, K extends keyof T`）で型安全にGUIバインディングを提供する。`*GuiController`側は`addFolder`→複数の`addElement`系→`resetFolder`という順で呼ぶのが定型。

## `Recorder`

```ts
export class Recorder {
    private canvas: HTMLCanvasElement;
    private options: RecordOptions | undefined;
    private frames: FrameData[] = [];
    private currentFrameCount: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.currentFrameCount = 450;   // ← resetRecord()の0とは異なる初期値
    }

    public resetRecord(): void {
        this.frames = [];
        this.currentFrameCount = 0;
    }
    // ...
}
```

`canvas.toBlob()`でPNGフレームを取得し、単一フレーム保存・連番フレームをJSZipでZIP一括保存・任意ファイル名指定保存の3パターンをサポートする通常のインスタンスクラス（`*GuiController`のような静的クラスではない）。`RecordingApplication`（`application.md`参照）から呼ばれる。コンストラクタで`currentFrameCount`を`450`に初期化している一方、`resetRecord()`では`0`にしている点は不自然に見える差異——修正が必要か確認せずに「バグだ」と決めつけて直さないこと（意図的な初期値の可能性もあるため、触る場合はユーザーに確認する）。

## `Operation`+`Base`ファミリーとの違い

このファミリーは`operation-base.md`の対象外——差し替え可能性やDIを意図した設計ではなく、「アプリに1つだけ存在するGUI/録画機能をどう組み立てるか」という別種の関心事に対する別パターン。新規のデバッグツール・GUIコントローラーを追加する場合は`Operation`+`Base`ではなくこのファイルのパターンに合わせる。
