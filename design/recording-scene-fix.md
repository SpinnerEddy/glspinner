# 録画機構（FixedTimeClockが効かない問題）の修正

**ステータス**: 提案（未実装）
**対象**: `src/app/RecordingApplication.ts`, `src/scene/core/RecordScene.ts`（削除）, `src/index.ts`

## Context（なぜこの変更をするか）

重いシーンでも指定fps・指定枚数を確実に撮れるようにするため、`FixedTimeClock`（シミュレーション時間`elapsedTime`をキャプチャの実処理時間から切り離す決定論的フレーム送り）を実装したが動作しなかった、という相談から出発した。

最初のレビューで`RecordScene.record()`（fps/frameNumのハードコード、`i=450`起点、固定700ms待機、`stop()`が効かない等）に多数の問題を見つけたが、`glspinner-design`での追加調査で**より根本的な事実が判明した**: `examples/sample.ts`は`RecordingApplication`のコンストラクタが`RecordScene`型を要求するにもかかわらず、実際には素の`Scene`を渡している（`Scene`/`RecordScene`はどちらも`SceneOperation`を実装しているため構造的に型チェックを通過するだけで、実行時の実体は`Scene`）。`new RecordScene(...)`という呼び出しはリポジトリ全体のどこにも存在しない。

つまり最初に見つけた`RecordScene.record()`のバグ群は**実際には一度も実行されないコードパス**の話であり、実際に動いているのは`Scene.start()` → `Scene.run()`（通常の`requestAnimationFrame`連続ループ）だった。

`Scene.run()`の実装:
```ts
private async run(): Promise<void> {
    if (!this.isRunning) return;
    this.clock.update();

    // if(this.clock.shouldDraw()){
    //     this.updateObjects();
    //     this.drawObjects();
    //     await this.additionalSupport();
    // }

    this.updateObjects();
    this.drawObjects();
    await this.additionalSupport();

    this.animationId = requestAnimationFrame(() => { this.run(); });
}
```

`shouldDraw()`によるゲートがコメントアウトされたまま（`.claude/rules/clock.md`に既知の未接続として記載済み）で、`updateObjects`/`drawObjects`/`additionalSupport()`（＝フレーム保存）が毎rAFティック無条件に実行される。`FixedTimeClock.shouldDraw()`は`frameCount % Math.floor(60/fps) == 0`のときだけtrueを返す「fpsに応じて間引く」ロジックを持つが、呼び出し箇所が無効化されているため一切効かない。これが「`FixedTimeClock`を実装したのに反映されない」の実際の原因。

**この`shouldDraw()`ゲートを`Scene.run()`全体（`updateObjects`/`drawObjects`/`additionalSupport`すべてを囲む形）にそのまま復活させる案は、レビューの過程でユーザーから「以前このゲートを有効にしたとき、描画がカクつく・fpsが落ちたように見えたのでコメントアウトを外した記憶がある」という指摘があり撤回した。** 原因は`RealTimeClock.shouldDraw()`の実装にある——`lastDrawCallTime`という実時間の累積値を`frameInterval`（固定値）と比較する方式のため、`requestAnimationFrame`自体のわずかなタイミングジッター（16ms/17ms/18msのようなブレ）によって、本来毎ティック描画してよいはずの場面で不規則に1ティック分の描画を持ち越してしまう（同じフレームが2回表示される＝フレーム二重表示）。60Hz程度のディスプレイでは`requestAnimationFrame`が既に適切なペースで呼ばれているため、この追加のゲートは間引きのメリットが無く、ジッターによる間引きミスというデメリットだけが表面化する。詳細は下記「設計」1番の改訂版を参照。

## 決定事項（会話で合意済み）

| 論点 | 決定 |
|---|---|
| 修正方向 | `Scene`側を直す。`RecordScene`は独立の実行モデル（`requestAnimationFrame`に依存しない手動forループ）を今後も維持する積極的理由が無いため、修正対象にしない |
| `shouldDraw()`ゲートをどこに配置するか | **（改訂）** `Scene.run()`全体ではなく、`RecordingApplication.additionalSupport()`（フレーム保存の直前）だけに限定する。`Scene.run()`の`updateObjects`/`drawObjects`は毎ティック無条件実行のまま変更しない。理由: 以前`Scene.run()`全体を`shouldDraw()`で囲む形にした際、`RealTimeClock.shouldDraw()`の実時間累積比較がrAFのタイミングジッターと干渉し、描画のカクつき（フレーム二重表示）を引き起こした実績があるため。フレーム保存だけをゲートすれば通常のプレビュー描画の滑らかさに影響しない |
| `RecordScene`の扱い | 未使用・既知のバグを多数抱えたまま残すと将来再度同じ勘違いを誘発するため、**削除を推奨**（`src/index.ts`のexportも削除）。ユーザーが「後で別の実行モデルとして活用したい」と考える場合は残す判断もあり得るため、最終判断はユーザーに委ねる |
| `RecordingApplication`のコンストラクタ引数型 | `RecordScene`→`SceneOperation`に戻す。`BaseApplication`のコンストラクタは元々`SceneOperation`を受け取る設計で、`RecordingApplication`側の`RecordScene`への型の絞り込みが実態（`Scene`が渡されている）と食い違っていたための修正 |
| フレーム数（`frameNum`）の自動終了 | スコープに含める。`RecordingApplication.additionalSupport()`は`this.scene.getClock().getFrameCount()`を既に持っているため、これと`RecordGuiController.recordOptions.frameNum`を直接比較して`frameNum`到達時に`this.endRecording()`を呼ぶ形にする（`Recorder.endRecordingAuto()`/`this.currentFrameCount`経由の既存の仕組みは、後述の理由で今回は使わない） |
| `saveFrameWithName`と`frames`配列・`saveFramesAsZip`の不整合 | 今回のスコープ外。理由: 毎フレーム個別ダウンロードかZIPにまとめるかは「FixedTimeClockが効くようにする」という今回の目的とは別軸の問題で、ブラウザの大量自動ダウンロード制限への対処も絡み検討事項が増えるため、別タスクとして切り出す |

## 設計

### 1. `src/scene/core/Scene.ts` — 変更しない

```ts
// 現状のまま。updateObjects/drawObjects/additionalSupportは毎rAFティック無条件に実行する
private async run(): Promise<void> {
    if (!this.isRunning) return;
    this.clock.update();
    this.updateObjects();
    this.drawObjects();
    await this.additionalSupport();
    this.animationId = requestAnimationFrame(() => { this.run(); });
}
```

**（改訂）** 当初案の「`shouldDraw()`ゲートを`Scene.run()`全体に復活させる」は撤回した。`updateObjects`/`drawObjects`を毎ティック無条件で動かし続けることで、通常のプレビュー表示の滑らかさ（以前この部分をゲートして体感が悪化した実績がある）に一切影響を与えない。`shouldDraw()`によるフレーム間引きは、次項の`RecordingApplication.additionalSupport()`側だけに限定して導入する。

1ループ=1 rAFティックというシーケンシャルな実行モデルの中で`frameCount`（＝ループの反復回数）は`Scene.run()`の変更に関わらず毎ティック進むので、重いシーンでキャプチャが遅くても`FixedTimeClock`が刻むシミュレーション時間の正しさには影響しない——キャプチャに実時間がどれだけかかっても、出力されるフレーム数・各フレームのシミュレーション時刻は狂わない、という当初の目的は次項の変更だけで満たせる。

### 2. `src/app/RecordingApplication.ts` — コンストラクタ引数型を`SceneOperation`に戻す

```ts
import { SceneOperation } from '../scene/core/SceneOperation';
// import { RecordScene } from '../scene/core/RecordScene';  ← 削除

export abstract class RecordingApplication extends BaseApplication {
    protected recorder: Recorder;
    private isRecording: boolean;

    constructor(scene: SceneOperation) {
        super(scene);
        ...
    }
    ...
}
```

`RecordingApplication`が実際に使っているのは`setUpdate`/`setDraw`/`setAdditionalSupport`/`setRealTimeClock`/`setFixedTimeClock`/`getClock`のみで、すべて`SceneOperation`インターフェースに含まれるため、`RecordScene`固有の機能への依存はない（実際に確認済み）。

### 3. `src/scene/core/RecordScene.ts`・`src/index.ts` — 削除（推奨）

`RecordScene.ts`を削除し、`src/index.ts`の`export * from './scene/core/RecordScene';`の行を削除する。

### 4. `src/app/RecordingApplication.ts` — `additionalSupport()`に`shouldDraw()`ゲートとframeNum自動終了を追加

```ts
async additionalSupport(): Promise<void> {
    if (this.isRecording && this.scene.getClock().shouldDraw()) {
        const frameCount = this.scene.getClock().getFrameCount();
        const name = `frame_${String(frameCount + 1).padStart(5, '0')}.png`;
        await this.recorder.saveFrameWithName(name);

        const targetFrameNum = RecordGuiController.recordOptions.frameNum;
        if (RecordGuiController.recordOptions.type !== 'StartAndStop' && targetFrameNum !== undefined && frameCount + 1 >= targetFrameNum) {
            this.endRecording();
        }
    }
}
```

**`this.scene.getClock().shouldDraw()`をここに追加するのが今回の核心的な修正。** `Scene.run()`は`updateObjects`/`drawObjects`を毎ティック無条件に実行するため描画の滑らかさには影響しないが、フレーム**保存**はこの`shouldDraw()`の結果に従うため、`FixedTimeClock`使用時は`frameCount % Math.floor(60/fps) == 0`のタイミングでのみPNGが保存されるようになる（＝狙ったfpsペースでの保存）。`FixedTimeClock.shouldDraw()`は整数の`frameCount`だけを見る判定なので、`RealTimeClock.shouldDraw()`のような実時間累積によるジッターの影響を受けず、録画用途としてはこちらの方が本質的に安定している。

`Recorder.endRecordingAuto()`（`this.currentFrameCount`ベース）は使わない。`Recorder.currentFrameCount`は`saveSequentialFrames()`だけが更新するフィールドで、実際の録画経路が呼ぶ`saveFrameWithName()`では更新されないため、`endRecordingAuto()`を有効化しても正しく動かない（下記「別枠の問題」と同根）。`RecordingApplication`は既に`scene.getClock().getFrameCount()`を持っているので、そちらを直接使う方が確実。

## 別枠の問題（今回のスコープ外、参考記録）

`RecordingApplication.additionalSupport()`が呼ぶ`Recorder.saveFrameWithName()`は`Recorder.frames`配列に追加しない（`this.frames`は`saveSequentialFrames()`だけが追加する配列で、実際の録画経路からは呼ばれていない）。そのため`recordType`を`'SequencialFrames'`にしていても、実際には毎フレーム個別にPNGが自動ダウンロードされ（ブラウザ側が大量の自動ダウンロードをブロックする可能性もある）、`endRecording()`の`saveFramesAsZip()`は常に空配列で何もしない。RealTimeでもFixedTimeでも共通して起きる問題であり、「FixedTimeClockを効かせる」という今回の目的とは別軸のため、別タスクとして扱う。

## 変更対象ファイル

- **変更しない**: `src/scene/core/Scene.ts`（`updateObjects`/`drawObjects`は毎ティック無条件実行のまま）
- **書き換え**: `src/app/RecordingApplication.ts`（コンストラクタ引数型変更、`additionalSupport()`への`shouldDraw()`ゲート＋frameNum自動終了追加）
- **削除**: `src/scene/core/RecordScene.ts`
- **書き換え**: `src/index.ts`（`RecordScene`のexport行を削除）
- **スコープ外**: `Recorder.saveFrameWithName`/`frames`配列/`saveFramesAsZip`の不整合（別タスク）

## 検証方法

- `npx tsc --noEmit`（または`npm run build`の型チェック部分）で型エラーが無いこと（`RecordScene`削除に伴う参照漏れが無いか特に確認）。
- `npm run lint`。
- 実機（`npm run dev`）で`RecordGuiController`から`clockType: Fixed`・`fps`を指定し、「StartRecord」を押してから指定した`frameNum`枚のPNGが保存された時点で自動的に録画が止まる（`isRecording`がfalseに戻る）ことを確認する。
- 同じ操作を重いシーン（ポストエフェクトを増やす等）でも行い、キャプチャが多少実時間としては遅くなっても、保存される`frame_XXXXX.png`の連番・想定されるシミュレーション時間の進みが乱れないことを確認する。
- **録画していない通常のプレビュー表示、および録画中の画面表示自体が、今回の変更前と同じ滑らかさで動いていること**を確認する（`Scene.run()`を変更しないため回帰は起きないはずだが、実地で確認する）。

## `.claude/rules/`への影響（実装後にフォローアップが必要）

- `.claude/rules/clock.md`: 「`Scene.run()`内で`shouldDraw()`がコメントアウトされたまま」という記載自体は`Scene.ts`を変更しないため引き続き正しいが、「`shouldDraw()`は`RecordingApplication.additionalSupport()`から呼ばれるようになった」という新しい接続先を追記する必要がある。
- `.claude/rules/operation-base.md`「Scene系」: `Scene`と`RecordScene`が兄弟クラスという記載自体が、`RecordScene`削除に伴い不要になる（`Scene`単独の記載に整理）。
- `.claude/rules/application.md`: `RecordingApplication`のコンストラクタ引数型が`SceneOperation`→`RecordScene`に狭められている、という記載を「`SceneOperation`のまま」に修正する必要がある。`additionalSupport()`が`shouldDraw()`を参照するようになったことも追記する。

いずれも実装完了後に`glspinner-conventions`で反映する。

## 実装分担についての注意

`.claude/CLAUDE.md`の編集範囲制限により、`src/`配下の実際のコード変更は原則ユーザー自身が行う。`RecordScene.ts`の削除と`RecordingApplication.ts`の型変更・`shouldDraw()`ゲート追加・自動終了ロジック追加は、ユーザーの明示的な同意があれば機械的反映の例外条件を満たしうる。

## この提案の経緯

ユーザーから「FixedTimeClockを実装したが動作しない」と相談を受け、実際に`RecordScene`/`Clock`ファミリー/`RecordingApplication`/`Recorder`/`RecordGuiController`を読んでレビューし、`RecordScene.record()`に多数のバグ（fps/frameNumハードコード、`i=450`起点、固定700ms待機、`stop()`無効等）を発見した。その後`glspinner-design`での設計検討に入り、`examples/sample.ts`の実際の呼び出しを調査した結果、`RecordScene`が実際には一度も`new`されておらず、型チェックが構造的に緩いために気づかれないまま死んでいたことが判明。実際に動いているのは`Scene.run()`で、そちらの`shouldDraw()`ゲートが無効化されたままだったことが真の原因と特定した。ユーザーに「`Scene`を直す」か「`RecordScene`を実際に使う形に直す」かを確認し、前者（`Scene`修正、`RecordScene`は削除検討）で合意した。

続けて、`Scene.run()`全体を`shouldDraw()`で囲む当初案を提示したところ、ユーザーから「以前このゲートを有効にした際、描画がカクつく・fpsが落ちたように見えたのでコメントアウトを外した記憶がある」という重要な指摘があった。`RealTimeClock.shouldDraw()`の実時間累積比較が`requestAnimationFrame`のタイミングジッターと干渉してフレーム二重表示を起こす、という原因を特定し、設計を「`Scene.run()`は変更せず、`RecordingApplication.additionalSupport()`（フレーム保存の直前）だけに`shouldDraw()`ゲートを限定する」形に改めた。これにより通常のプレビュー描画の滑らかさに影響を与えずに、録画時のフレーム保存だけをfpsペースで間引けるようになる。
