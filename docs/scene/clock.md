# scene/clock — 時間管理（リアルタイム/固定フレーム）

## 概要

`src/scene/clock/`は、フレームの経過時間・deltaTime・フレーム数を管理する。`ClockOperation`インターフェース→`Clock`（`BaseClock`ではなくOperationから"Operation"を除いただけの命名の抽象クラス）→`RealTimeClock`/`FixedTimeClock`の2具象クラスという構成。`Clock`は共通実装がかなり厚い「濃いBase」型で、具象クラスが書くのは「時間の進め方」と「このフレームで描画すべきか」の2メソッドだけでよい。

## 主要クラス一覧

| クラス/ファイル | 役割 | 備考 |
|---|---|---|
| `ClockOperation.ts` | 契約インターフェース | 11メソッド |
| `Clock.ts` | 抽象基底（`Base`接頭辞なし） | `update`/`shouldDraw`以外の9メソッドを共通実装 |
| `RealTimeClock.ts` | `performance.now()`ベースの実時間クロック | 既定の時間管理方式 |
| `FixedTimeClock.ts` | フレームカウントベースの固定クロック | 実時間を一切見ない |

## アーキテクチャ・設計パターン

```ts
export interface ClockOperation {
    update(): void;
    setTimeScale(timeScale: number): void;
    setFps(fps: number): void;
    setFrameInterval(fps: number): void;
    setFrameNum(frame: number): void;
    shouldDraw(): boolean;
    getElapsedTime(): number;
    getDeltaTime(): number;
    getFrameCount(): number;
    getFrameInterval(): number;
    reset(): void;
}

export abstract class Clock implements ClockOperation {
    protected startTime: number;
    protected elapsedTime: number;
    protected timeScale: number;
    protected frameCount: number;
    protected deltaTime: number;
    protected lastDrawCallTime: number;
    protected fps: number;
    protected frameInterval: number;

    constructor() {
        this.startTime = performance.now();
        this.elapsedTime = 0.0; this.timeScale = 1; this.frameCount = 0; this.deltaTime = 0;
        this.lastDrawCallTime = -1; this.fps = 60; this.frameInterval = 1 / this.fps;
    }

    setFps(fps): void { this.fps = fps; this.frameInterval = 1 / this.fps; }
    setFrameInterval(fps): void { this.frameInterval = 1 / fps; }
    setTimeScale(timeScale): void { this.timeScale = timeScale; }
    setFrameNum(frame): void { this.frameCount = frame; this.elapsedTime = this.frameInterval * this.frameCount; }
    getElapsedTime/getDeltaTime/getFrameCount/getFrameInterval(): number { /* フィールドをそのまま返す */ }
    reset(): void { /* startTime以外をゼロクリア、timeScaleは1に戻す */ }

    abstract update(): void;
    abstract shouldDraw(): boolean;
}
```

11個の契約メソッドのうち`update()`と`shouldDraw()`の2つだけが`abstract`のまま残り、残り9つは全て共通実装を持つ。これは`device.md`が扱う`BaseDevice`（`isDown`等3メソッドすべて`abstract`）とは対照的な「濃いBase」設計。

## 主要クラス詳細

### `RealTimeClock`

```ts
export class RealTimeClock extends Clock {
    private lastTime: number;
    constructor() { super(); this.lastTime = 0; }

    update(): void {
        const currentTime = performance.now();
        this.elapsedTime = (currentTime - this.startTime) * this.timeScale / 1000;
        this.deltaTime = Math.max((currentTime - this.lastTime) * this.timeScale / 1000, 0);
        this.lastTime = currentTime;
        this.frameCount++;
        if (this.lastDrawCallTime <= -1) this.lastDrawCallTime = this.deltaTime;
        else this.lastDrawCallTime += this.deltaTime;
    }

    shouldDraw(): boolean {
        if (this.lastDrawCallTime == -1) return true;
        if (this.lastDrawCallTime >= this.frameInterval) { this.lastDrawCallTime = -1; return true; }
        return false;
    }

    reset(): void { super.reset(); this.lastTime = 0; }
}
```

`performance.now()`による実時間ベースで`elapsedTime`/`deltaTime`を計算し、`lastDrawCallTime`（前回描画からの累積時間）を`frameInterval`（fps由来の目標間隔）と比較して間引き描画の要否を`shouldDraw()`で判定する。既定のシーンクロックとして`Scene`/`RecordScene`双方のコンストラクタで生成される。

### `FixedTimeClock`

```ts
export class FixedTimeClock extends Clock {
    update(): void {
        this.frameCount++;
        if (this.frameCount % Math.floor(60 / this.fps) == 0) this.elapsedTime += this.frameInterval;
    }
    shouldDraw(): boolean {
        if (this.frameCount == 0) return true;
        if (this.frameCount % Math.floor(60 / this.fps) == 0) return true;
        return false;
    }
    reset(): void { super.reset(); }
}
```

実時間を一切見ず、`frameCount % Math.floor(60 / this.fps)`という固定フレーム数ベースの判定のみで進行する。アニメーション書き出しのような非リアルタイム実行向けで、`RecordingApplication.changeSceneClock()`（`docs/app/app.md`参照）が`RecordScene.setFixedTimeClock()`を呼ぶ際に使われる。

## `Scene`/`RecordScene`との関係（周辺クラス）

`Clock`自体は`~Node`のようにシーングラフに属さず、`Scene`/`RecordScene`（`docs/scene/core.md`参照）が`private clock: ClockOperation`として1つ保持し、デフォルトで`RealTimeClock`を生成する。

```ts
// Scene.ts
constructor() {
    this.clock = new RealTimeClock();
    this.clock.reset();
    this.clock.setFps(60);
}
setRealTimeClock(fps: number): void {
    this.clock = new RealTimeClock(); this.clock.reset(); this.clock.setFps(fps);
}
setFixedTimeClock(fps: number, frameInterval: number): void {
    this.clock = new FixedTimeClock(); this.clock.reset(); this.clock.setFps(fps); this.clock.setFrameInterval(frameInterval);
}
```

`setRealTimeClock()`/`setFixedTimeClock()`は既存インスタンスの内部状態を作り替えるのではなく、`this.clock`を丸ごと新しいインスタンスへ差し替える運用。

`Scene`は`getClock(): ClockOperation`という通常のgetterメソッドに加え、`get Clock(): ClockOperation`というアクセサ形式のgetterも同時に持ち、同じ内容を2通りの方式で公開している（プロジェクト全体のgetter/setter方式の揺れの一種）。実際の呼び出し箇所（`RecordingApplication.additionalSupport()`等）はすべて`getClock()`側を使う。

## 他モジュールとの関係

- **`scene/core.md` (`Scene`/`RecordScene`)**: 唯一の保持者。`RecordScene.record()`は`clock.setFrameNum(i)`で任意のフレーム番号へ直接ジャンプする（実時間を進めるのではなく、フレーム数から`elapsedTime`を逆算する）。
- **`app/app.md` (`RecordingApplication`)**: `changeSceneClock()`が`RealTimeClock`/`FixedTimeClock`を切り替える。

## 既知の制約・未完成部分

`Scene.run()`側で`shouldDraw()`による間引き描画ロジックの呼び出しがコメントアウトされているため、`shouldDraw()`自体は実装済みだが実際には使われていない（`docs/scene/core.md`参照）。
