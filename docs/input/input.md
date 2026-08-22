# input — キーボード/マウス/MIDI入力デバイス抽象化

## 概要

`src/input/`は、キーボード・マウス・MIDIという異なる入力デバイスを`DeviceOperation`という共通契約で統一的に扱うレイヤー。`InputHub`がジェネリックなデバイス集合を保持し、アプリ側は`isDown`/`isPressed`/`isReleased`という統一APIでデバイス種別を意識せず入力を問い合わせられる。

## 主要クラス一覧

| クラス/ファイル | 役割 | 備考 |
|---|---|---|
| `device/DeviceOperation.ts` | 契約インターフェース | `update`/`isDown`/`isPressed`/`isReleased`の4メソッド |
| `device/BaseDevice.ts` | 抽象基底 | `currentInput`/`prevInput`の保持のみ共通化、4メソッドはすべて`abstract` |
| `device/KeyboardDevice.ts` | キーボード入力 | `keydown`/`keyup`イベントで`currentInput`を更新 |
| `device/MouseDevice.ts` | マウス入力 | ボタン状態に加え位置(`position`)・移動量(`getDelta()`)を保持 |
| `device/MidiDevice.ts` | MIDI入力（未実装スタブ） | `isDown`/`isPressed`/`isReleased`は`false`固定 |
| `InputHub.ts` | デバイス集合のハブ | ジェネリック`TDevices`でデバイス構成を拡張可能に |
| `InputConstants.ts` | 定数群 | `DeviceName`/`MouseButton`/`KeyboardCode`等 |

## アーキテクチャ・設計パターン

`BaseDevice`は`currentInput`/`prevInput`（`InputInfoPairs = Record<string, boolean>`）という2フィールドの保持と初期化のみを共通化し、`isDown`/`isPressed`/`isReleased`はすべて`abstract`のまま——他ファミリー（例: `BaseMaterial`が`use()`/`getAttribute()`を共通化）と比べて共通化の薄いBaseになっている。

```ts
export abstract class BaseDevice implements DeviceOperation {
    protected currentInput: InputInfoPairs;
    protected prevInput: InputInfoPairs;
    constructor() { this.currentInput = {}; this.prevInput = {}; }
    abstract update(): void;
    abstract isDown(code): boolean;
    abstract isPressed(code): boolean;
    abstract isReleased(code): boolean;
}
```

## 主要クラス詳細

### `KeyboardDevice` / `MouseDevice`（判定ロジックの重複）

両クラスとも次の同一パターンを個別に実装している（`BaseDevice`側にテンプレートメソッド化されていない既知の重複）:

```ts
update(): void { this.prevInput = { ...this.currentInput }; }
isDown(type): boolean { return this.currentInput[type] ?? false; }
isPressed(type): boolean {
    const prev = this.prevInput[type] ?? false;
    const current = this.currentInput[type] ?? false;
    return !prev && current;
}
isReleased(type): boolean {
    const prev = this.prevInput[type] ?? false;
    const current = this.currentInput[type] ?? false;
    return prev && !current;
}
```

`isDown`=現在値、`isPressed`=前回false&今回true、`isReleased`=前回true&今回false、という判定になる。

`KeyboardDevice`はコンストラクタで`window.addEventListener('keydown'/'keyup', ...)`を登録し、`event.code`（`KeyboardCodeType`）をキーに`currentInput`を更新する。

`MouseDevice`は加えてマウス位置(`position: Vector2`)を`mousemove`イベントで追跡し、`getPosition()`/`getDelta()`（`VectorCalculator.sub(prevPosition, position)`）を独自に持つ。ボタン判定は`event.button`（`MouseButtonType` = `LEFT:0`/`MIDDLE:1`/`RIGHT:2`）をキーにする。

### `MidiDevice`（未実装スタブ）

```ts
constructor() {
    super();
    window.navigator.requestMIDIAccess().then((midi) => {
        midi.inputs.forEach((input) => { input.onmidimessage = (e) => { console.log(e.data); }; });
        midi.outputs.forEach((output) => { output.open(); /* LED点灯用と見られる大量のsend()呼び出し */ });
    });
}
update(): void {}
isDown(): boolean { return false; }
isPressed(): boolean { return false; }
isReleased(): boolean { return false; }
```

`navigator.requestMIDIAccess()`でMIDI入出力自体は取得し、受信メッセージを`console.log`するところまでは実装されているが、`isDown`/`isPressed`/`isReleased`は`false`固定のスタブ。コンストラクタ内には、MIDIコントローラーのLEDを光らせるとみられる大量の`output.send([...])`呼び出しが実験的に書かれている（チャンネル・ノート番号を直接指定するハードコード）。

### `InputHub`

```ts
export class InputHub<TDevices extends Record<string, DeviceOperation> = Record<string, DeviceOperation>> {
    private devices: TDevices;
    constructor() {
        this.devices = {
            [DeviceName.Mouse]: new MouseDevice(),
            [DeviceName.Keyboard]: new KeyboardDevice(),
            // [DeviceName.Midi]: new MidiDevice()
        } as DefaultDevices & TDevices;
    }
    update(): void { for (const device of Object.values(this.devices)) device.update(); }
    isDown(option: InputOption): boolean { /* resolveDevice(option.device).isDown(option.type) */ }
    isPressed(option: InputOption): boolean { /* 同様 */ }
    isReleased(option: InputOption): boolean { /* 同様 */ }
    getMousePosition(): Vector2 { /* devices[Mouse] as MouseDeviceにキャストして委譲 */ }
    getMouseDelta(): Vector2 { /* 同様 */ }
}
```

ジェネリック`TDevices`でデバイス集合を拡張可能にしているが、現状`Mouse`/`Keyboard`のみを保持し、`Midi`はコメントアウトで無効化されたままになっている。`InputOption {device, type}`を渡すことでデバイス種別を意識せず統一的に`isDown`/`isPressed`/`isReleased`を呼べる。

### `InputConstants`

`DeviceName`(`Mouse`/`Keyboard`/`Midi`)、`MouseButton`(`LEFT`/`MIDDLE`/`RIGHT`)、`KeyboardCode`（アルファベット・数字・ファンクションキー・矢印キー・スペースを網羅した`event.code`文字列のマップ）を定数オブジェクト+Union型導出パターンで定義する。

## 他モジュールとの関係

- **`app/app.md` (`BaseApplication`)**: コンストラクタで`inputHub: InputHub`を1つ生成し、`protected`フィールドとして利用者側`setup`/`update`/`draw`から参照できるようにする。
- **`math/math.md` (`Vector2`)**: マウス位置・移動量の型として使われる。

## 既知の制約・未完成部分

`MidiDevice`は`isDown`/`isPressed`/`isReleased`が`false`固定のスタブ状態で、`InputHub`側でも接続がコメントアウトされている（README「課題」に明記された既知の未解決事項: チャンネルの定義、操作時に実行する処理の紐づけ、LED制御などの設計が固まっていない）。
