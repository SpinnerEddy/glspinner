# `AudioOutput`/`AudioInputOperation` ファミリー規約

`src/scene/audio/`配下。`~Material`や`~Device`のような接頭辞・接尾辞の統一はないが、「再生を担当する`AudioOutput`（Operationインターフェースを持たない具象クラス1つ） + 音データ供給を差し替え可能にする`AudioInputOperation`インターフェース + その実装2つ」という明確なファミリーを成す。ユーザーの列挙例には含まれていないが、`Operation`インターフェースを持つ具象クラスが複数ある独立ファミリーのため`.claude/rules/`の1ファイルとして扱う。

## 構成

- `AudioOutput`（`Operation`インターフェースを持たない、唯一の再生担当クラス）
- `AudioInputOperation`（インターフェース、`load()`/`getBuffer()`のみの小さな契約。`BaseXxx`層は無い——具象2クラスが直接implementsする、`operation-base.md`の小規模ファミリーと同種のパターン）
- `ExternalFileAudioInput` / `ShaderAudioInput`（`AudioInputOperation`の具象2クラス）

## 再生とデータ供給の分離

```ts
export class AudioOutput {
    private audioContext: AudioContext;
    private audioBuffer: AudioBuffer | undefined;
    private sourceNode: AudioBufferSourceNode | undefined;

    public playAudio(offset: number = 0): void { /* AudioBufferSourceNodeを生成して再生 */ }
    public pauseAudio(): void { /* ... */ }
    public resumeAudio(): void { /* pauseTimeからplayAudio()を再呼び出し */ }
    public stopAudio(): void { /* ... */ }

    public setInput(audioInput: AudioInputOperation) {
        this.audioBuffer = audioInput.getBuffer();
    }
}
```

`AudioOutput`はWeb Audio APIの`AudioContext`/`AudioBufferSourceNode`をラップし、play/pause/resume/stopのシンプルな再生制御のみを担当する。実際の音データ供給は`setInput(audioInput: AudioInputOperation)`で外部から注入する（`audioInput.getBuffer()`を呼んで`audioBuffer`にセットするだけ）。「再生の仕方」と「音データをどう作るか」が完全に分離されており、`AudioOutput`自身は音データの出自を知らない。

## `AudioInputOperation`の2つの実装

```ts
export interface AudioInputOperation {
    load(path: string, audioContext: AudioContext): Promise<void>;
    getBuffer(): AudioBuffer;
}
```

- **`ExternalFileAudioInput`**: `fetch` + `AudioContext.decodeAudioData`で外部音声ファイルを読み込む標準的な実装。
- **`ShaderAudioInput`**: WebGL2の**Transform Feedback**を使い、GLSLシェーダ（頂点シェーダ側で波形をプロシージャル生成）の出力を直接`AudioBuffer`へ変換する実験的な実装。`gl.enable(gl.RASTERIZER_DISCARD)`でラスタライズをスキップしつつ`gl.drawArrays(gl.POINTS, ...)`でサンプルを生成し、`gl.getBufferSubData()`でCPU側に読み戻す。シェーダーでサウンドを生成する（"shader-based procedural audio"）という比較的珍しいアプローチ。
  - `saveToWav()`という`AudioInputOperation`の契約には無い固有メソッドを持つ（`material.md`で触れた「ファミリー内の非対称な拡張点」と同種のパターン）。WAVヘッダーを手組みして`Blob`+`<a download>`でファイル保存する。
  - `load()`メソッドの末尾に、サイン波を直接生成する旧実装がコメントアウトされたまま残っている（`general.md`「無効化中のコードは削除せずコメントアウトで残す」運用の実例）。

## 新規`AudioInputOperation`実装を追加する場合

`load(path, audioContext)`と`getBuffer()`さえ満たせば、内部実装は自由（Web Audio APIのデコードでも、WebGL計算でも、Web Audio APIのAudioWorkletでもよい）。`BaseXxx`層が無いため、新たな共通ロジックが必要になった時点で抽象クラスを挟むかどうかを検討する（`glspinner-design`の仕事）。
