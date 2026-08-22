# scene/audio — 音声出力とデータ供給の分離レイヤー

## 概要

`src/scene/audio/`は「音声の再生制御」と「音声データをどう作るか」を明確に分離したサブシステム。`AudioOutput`（唯一の再生担当、`Operation`インターフェースを持たない）が`AudioInputOperation`という小さな契約を介して音データを受け取る。実装は「外部ファイルを読み込む」標準的な方式と、「WebGL2のTransform Feedbackでシェーダから直接波形を生成する」実験的な方式の2通りがある。

## 主要クラス一覧

| クラス/ファイル | 役割 | 備考 |
|---|---|---|
| `AudioOutput.ts` | 再生制御（play/pause/resume/stop） | `Operation`を持たない唯一の再生担当クラス |
| `AudioInputOperation.ts` | 音データ供給の契約 | `load()`/`getBuffer()`の2メソッドのみ |
| `ExternalFileAudioInput.ts` | `fetch`+`decodeAudioData`で外部音声ファイルを読み込む | 標準的な実装 |
| `ShaderAudioInput.ts` | Transform FeedbackでGLSLから波形を生成 | `saveToWav()`という契約外の固有メソッドを持つ |

## アーキテクチャ・設計パターン

`AudioOutput`はWeb Audio APIの`AudioContext`/`AudioBufferSourceNode`をラップし、play/pause/resume/stopのシンプルな再生制御のみを担当する。実際の音データ供給は`setInput(audioInput: AudioInputOperation)`で外部から注入し、`audioInput.getBuffer()`を呼んで`audioBuffer`にセットするだけ——`AudioOutput`自身は音データの出自（外部ファイルかシェーダ生成か）を一切知らない。

`AudioInputOperation`は`load(path, audioContext)`と`getBuffer()`さえ満たせば内部実装は自由という最小契約で、`BaseXxx`層は存在しない（具象2クラスが直接`implements`する小規模ファミリー）。

## 主要クラス詳細

### `AudioOutput`

```ts
export class AudioOutput {
    private audioContext: AudioContext;
    private audioBuffer: AudioBuffer | undefined;
    private sourceNode: AudioBufferSourceNode | undefined;
    private isPlaying = false;
    private pauseTime = 0;
    private startTime = 0;

    playAudio(offset = 0): void { /* AudioBufferSourceNodeを生成しstart(0, offset) */ }
    pauseAudio(): void { /* stop()してpauseTime = currentTime - startTimeを記録 */ }
    resumeAudio(): void { /* playAudio(pauseTime)を再呼び出し */ }
    stopAudio(): void { /* stop()してpauseTimeを0にリセット */ }
    setInput(audioInput: AudioInputOperation): void { this.audioBuffer = audioInput.getBuffer(); }
    getAudioContext(): AudioContext { return this.audioContext; }
}
```

`pauseAudio()`→`resumeAudio()`は、Web Audio APIの`AudioBufferSourceNode`が一度`stop()`すると再利用できない制約を踏まえ、`pauseTime`（一時停止した経過秒数）を記録しておいて`playAudio(pauseTime)`として新しいノードを作り直す、という定石の実装になっている。

### `ExternalFileAudioInput`

```ts
async load(path, audioContext): Promise<void> {
    const response = await fetch(path);
    const arrayBuffer = await response.arrayBuffer();
    this.audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
}
getBuffer(): AudioBuffer { return this.audioBuffer!; }
```

素直な`fetch`+`decodeAudioData`のみ。

### `ShaderAudioInput`（実験的: シェーダによるプロシージャル音声生成）

```ts
async load(path, audioContext): Promise<void> {
    const shader = this.shaderLoader.getShaderProgram(path);
    const sampleNums = Math.floor(this.sampleRate * this.duration);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, sampleNums * 2 * 4, gl.DYNAMIC_COPY);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffer);

    shader.use(gl);
    shader.setUniform(gl, 'uSampleRate', new ShaderUniformValue(this.sampleRate));
    shader.setUniform(gl, 'uTimeOffset', new ShaderUniformValue(0.0));

    gl.enable(gl.RASTERIZER_DISCARD);
    gl.beginTransformFeedback(gl.POINTS);
    gl.drawArrays(gl.POINTS, 0, sampleNums);
    gl.endTransformFeedback();
    gl.disable(gl.RASTERIZER_DISCARD);

    const samples = new Float32Array(sampleNums * 2);
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, buffer);
    gl.getBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER, 0, samples);
    // ステレオ2ch分をAudioBufferのチャンネルへ振り分け
}
```

頂点シェーダ側で波形をプロシージャル生成し、ラスタライズをスキップ（`RASTERIZER_DISCARD`）しつつ`POINTS`描画でサンプルだけを生成、`getBufferSubData()`でCPU側へ読み戻すという、"shader-based procedural audio"と呼べる比較的珍しいアプローチ。コンストラクタで`sampleRate`（既定44100）と`duration`（既定2.0秒）を受け取る。

`load()`メソッドの末尾には、サイン波を直接生成する旧実装がコメントアウトされたまま残っている（無効化したコードを削除せず残す、というプロジェクト全体の運用に沿ったもの）。

`saveToWav()`という`AudioInputOperation`契約に無い固有メソッドを持ち、WAVヘッダーを手組みして`Blob`+`<a download>`でファイル保存する。

## 他モジュールとの関係

- **`app/app.md` (`BaseApplication`)**: コンストラクタで`audioOutput: AudioOutput`を1つ生成し、`protected`フィールドとして利用者側`setup()`から参照できるようにする。
- **`webgl/gl.md` (`ShaderLoader`)**: `ShaderAudioInput`がTransform Feedback用のシェーダプログラムを取得する際に使う。
- **`tools.md` (`RecordGuiController`/`Recorder`)**: 直接の依存はないが、`examples/sample.ts`では`ShaderAudioInput`と録画機能が同じアプリ内で併用される。

## 既知の制約・未完成部分

`ShaderAudioInput`は実験的な実装で、`examples/sample.ts`でも`shaderAudioInput.load(...)`の呼び出しがコメントアウトされたままになっている箇所がある（`preload()`内）。
