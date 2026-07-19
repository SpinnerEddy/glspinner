# `~Device` ファミリー規約

`src/input/device/`配下。`XxxOperation`+`BaseXxx`の形はとるが、`BaseXxx`が共通ロジックを提供しない点がこのファミリー最大の特徴。

## 構成

- `DeviceOperation`（インターフェース）
- `BaseDevice`（抽象基底）
- 具象クラス3個: `KeyboardDevice`, `MouseDevice`, `MidiDevice`

## `DeviceOperation` / `BaseDevice`

```ts
export interface DeviceOperation {
    update(): void;
    isDown(type: MouseButtonType | KeyboardCodeType): boolean;
    isPressed(type: MouseButtonType | KeyboardCodeType): boolean;
    isReleased(type: MouseButtonType | KeyboardCodeType): boolean;
}

export abstract class BaseDevice implements DeviceOperation {
    protected currentInput: InputInfoPairs;
    protected prevInput: InputInfoPairs;

    constructor(){ this.currentInput = {}; this.prevInput = {}; }

    abstract update(): void;
    abstract isDown(code: MouseButtonType | KeyboardCodeType): boolean;
    abstract isPressed(code: MouseButtonType | KeyboardCodeType): boolean;
    abstract isReleased(code: MouseButtonType | KeyboardCodeType): boolean;
}
```

**`BaseDevice`は`currentInput`/`prevInput`という2つのフィールドと初期化しか共通化していない。`isDown`/`isPressed`/`isReleased`はすべて`abstract`のままで、実装ロジックは共通化されていない。** これは他ファミリー（`BaseMaterial`が`use()`/`getAttribute()`を共通化しているなど）と比べて薄い共通化であり、意図的な設計というよりテンプレートメソッド化されていない既知の重複と考えられる。

## 具象クラスで重複している判定ロジック

`KeyboardDevice`の実装（`MouseDevice`もほぼ同型）:

```ts
update(): void {
    this.prevInput = { ...this.currentInput };
}

isDown(type): boolean {
    return this.currentInput[type] ?? false;
}

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

新規デバイスクラス（例: ゲームパッド）を追加する場合、この判定ロジック（`isDown`=現在値、`isPressed`=前回false&今回true、`isReleased`=前回true&今回false）をそのまま複製するのが既存の流儀。`BaseDevice`側に引き上げてテンプレートメソッド化する設計変更は、複数の具象クラスに影響する範囲の広い変更になるため、`glspinner-tidy`のような機械的整形の範囲を超える。行う場合は`glspinner-design`で設計判断として扱う。

## 既知の未実装

`MidiDevice`は`navigator.requestMIDIAccess()`でMIDI入出力を取得するが、`isDown`/`isPressed`/`isReleased`が`false`固定でconsole.logするだけの未実装状態（README「課題」に「MIDIコントローラーの扱い——チャンネルの定義、操作時に実行する処理の紐づけ、LED制御などの設計を固めきれてない」と明記されている既知の課題）。新規にMIDI関連のデバイス機能を実装する際は、このファミリーの既存2クラス（`KeyboardDevice`/`MouseDevice`）の判定ロジックパターンに合わせる。

## `InputHub`との関係（周辺クラス）

`InputHub`（`src/input/InputHub.ts`）はジェネリック`TDevices extends Record<string, DeviceOperation> = Record<string, DeviceOperation>`でデバイス集合を拡張可能にした、このファミリーの外側にあるハブクラス。現状`Mouse`/`Keyboard`をまとめて保持し（`Midi`はコメントアウトで無効化中、`general.md`「無効化中のimport」参照）、`InputOption {device, type}`を渡すことでデバイス種別を意識せず`isDown`/`isPressed`/`isReleased`を呼べる統一APIを提供する。`update()`は全デバイスの`update()`（`prevInput`のスナップショット更新）を一括で回す。
