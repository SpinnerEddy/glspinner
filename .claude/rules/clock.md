# `~Clock` ファミリー規約

`src/scene/clock/`配下。`XxxOperation`+`BaseXxx`の標準形からの命名面での逸脱が特徴——中間の抽象クラスが**`BaseClock`ではなく`Clock`という、インターフェース名から`Operation`を除いただけの名前**になっている（`vector-matrix.md`の`VectorOperation`→`Vector`、`MatrixOperation`→`Matrix`と同型の命名パターン）。実装面では`BaseDevice`のような「薄いBase」ではなく、共通ロジックをかなり厚く持つ「濃いBase」である点も特徴。

## 構成

- `ClockOperation`（インターフェース、`src/scene/clock/ClockOperation.ts`）
- `Clock`（抽象基底。`Base`接頭辞を使わない、`src/scene/clock/Clock.ts`）
- 具象クラス2個: `RealTimeClock`, `FixedTimeClock`（いずれも`Clock`を継承）

## `ClockOperation` / `Clock`

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
        this.elapsedTime = 0.0;
        this.timeScale = 1;
        this.frameCount = 0;
        this.deltaTime = 0;
        this.lastDrawCallTime = -1;
        this.fps = 60;
        this.frameInterval = 1 / this.fps;
    }

    public setFps(fps: number): void { this.fps = fps; this.frameInterval = 1 / this.fps; }
    public setFrameInterval(fps: number): void { this.frameInterval = 1 / fps; }
    public setTimeScale(timeScale: number) { this.timeScale = timeScale; }
    public setFrameNum(frame: number): void {
        this.frameCount = frame;
        this.elapsedTime = this.frameInterval * this.frameCount;
    }
    public getElapsedTime(): number { return this.elapsedTime; }
    public getDeltaTime(): number { return this.deltaTime; }
    public getFrameCount(): number { return this.frameCount; }
    public getFrameInterval(): number { return this.frameInterval; }
    public reset(): void {
        this.startTime = performance.now();
        this.elapsedTime = 0.0;
        this.timeScale = 1;
        this.frameCount = 0;
        this.deltaTime = 0;
    }

    public abstract update(): void;
    public abstract shouldDraw(): boolean;
}
```

`Clock`は11個の契約メソッドのうち`update()`と`shouldDraw()`の2つだけを`abstract`のまま残し、残り9つ（`setFps`/`setFrameInterval`/`setTimeScale`/`setFrameNum`/4つの`getXxx`/`reset`）は全て共通実装を持つ。これは`device.md`の`BaseDevice`（`isDown`/`isPressed`/`isReleased`が3つとも`abstract`）や`flow.md`の`BaseSceneRendererFlow`（共通実装なし）とは対照的な「濃いBase」であり、`geometry.md`の`BaseGeometry`（`bind`/`unbind`/`getIndexCount`/`dispose`を共通化し`setUpBuffers`のみ抽象）に近い設計密度。新規に`~Clock`系クラスを追加する場合、時間管理の状態フィールド（`startTime`/`elapsedTime`/`timeScale`/`frameCount`/`deltaTime`/`lastDrawCallTime`/`fps`/`frameInterval`）を再利用でき、書くべきは「時間の進め方（`update`）」と「このフレームで描画すべきか（`shouldDraw`）」の2メソッドだけでよい。

## 具象クラスの実装パターン

`update()`と`shouldDraw()`（と`reset()`の`super`呼び出し付きオーバーライド）だけが具象クラスの差分になる。

```ts
export class RealTimeClock extends Clock {
    private lastTime: number;

    constructor() { super(); this.lastTime = 0; }

    public update(): void {
        const currentTime = performance.now();
        this.elapsedTime = (currentTime - this.startTime) * this.timeScale / 1000;
        this.deltaTime = Math.max((currentTime - this.lastTime) * this.timeScale / 1000, 0);
        this.lastTime = currentTime;
        this.frameCount++;
        if (this.lastDrawCallTime <= -1) { this.lastDrawCallTime = this.deltaTime; }
        else { this.lastDrawCallTime += this.deltaTime; }
    }

    public shouldDraw(): boolean {
        if (this.lastDrawCallTime == -1) return true;
        if (this.lastDrawCallTime >= this.frameInterval) { this.lastDrawCallTime = -1; return true; }
        return false;
    }

    public reset(): void { super.reset(); this.lastTime = 0; }
}
```

```ts
export class FixedTimeClock extends Clock {
    constructor() { super(); }

    public update(): void {
        this.frameCount++;
        if (this.frameCount % Math.floor(60 / this.fps) == 0) {
            this.elapsedTime += this.frameInterval;
        }
    }

    public shouldDraw(): boolean {
        if (this.frameCount == 0) return true;
        if (this.frameCount % Math.floor(60 / this.fps) == 0) return true;
        return false;
    }

    public reset(): void { super.reset(); }
}
```

`RealTimeClock`は`performance.now()`による実時間ベースで`elapsedTime`/`deltaTime`を計算し、`lastDrawCallTime`を`frameInterval`（fps由来の目標間隔）と比較して間引き描画の要否を`shouldDraw()`で判定する。`FixedTimeClock`は実時間を一切見ず、`frameCount % Math.floor(60 / this.fps)`という固定フレーム数ベースの判定のみで進行する（アニメーション書き出しのような非リアルタイム実行向け、`operation-base.md`「Scene系」の`RecordScene`が使う）。`reset()`をオーバーライドする場合は`super.reset()`を呼んでから追加フィールド（`RealTimeClock.lastTime`等）をリセットする、というパターンに合わせる。

新規クラス例（ジオメトリ的な検討ではなく「進み方」の検討）としては、`FixedTimeClock`同様に`this.fps`/`this.frameInterval`という`Clock`側の状態を再利用しつつ、`==`比較（`this.lastDrawCallTime == -1`、`this.frameCount == 0`）を使う既存の書き方に合わせるのが自然（`general.md`「未解決・揺れがある事項」1番、このファミリーでは`==`/`!=`が一貫している）。

## `Scene`との関係（周辺クラス）

`Clock`自体は`~Node`のようにシーングラフに属さず、`Scene`（`operation-base.md`「Scene系」参照）が`private clock: ClockOperation`として1つ保持し、デフォルトで`RealTimeClock`を生成する。

```ts
// Scene.ts
private clock: ClockOperation;
constructor() {
    this.clock = new RealTimeClock();
    this.clock.reset();
    this.clock.setFps(60);
}
public setRealTimeClock(fps: number): void {
    this.clock = new RealTimeClock();
    this.clock.reset();
    this.clock.setFps(fps);
}
public setFixedTimeClock(fps: number, frameInterval: number): void {
    this.clock = new FixedTimeClock();
    this.clock.reset();
    this.clock.setFps(fps);
    this.clock.setFrameInterval(frameInterval);
}
```

`setRealTimeClock()`/`setFixedTimeClock()`で`this.clock`を丸ごと新しいインスタンスへ差し替える（既存インスタンスの内部状態を作り替えるのではなく再生成する）という運用。`RecordingApplication.changeSceneClock()`（`application.md`参照）がこの2メソッドを呼び分けて録画時のクロック種別を切り替える、というのがこのファミリーの主な利用箇所。

`Scene`は`getClock(): ClockOperation`という通常のgetterメソッドに加え、`get Clock(): ClockOperation`というアクセサ形式のgetterも同時に持っており、同じ内容を2通りの方式で公開している（`general.md`「未解決・揺れがある事項」6番のgetter/setter方式の混在の一種だが、片方が完全な重複というこのファイル特有のケース。新規にクロックへアクセスする場合は既存の呼び出し箇所に合わせて`getClock()`側を使うのが無難——`RecordingApplication.additionalSupport()`など既存コードは全て`getClock()`を使っている）。

`Scene.run()`内では`shouldDraw()`による間引き描画ロジックが実装されているが呼び出し箇所がコメントアウトされたままで、毎フレーム無条件にupdate/drawしている（`application.md`「起動シーケンス」に関連する既知の未接続）。
