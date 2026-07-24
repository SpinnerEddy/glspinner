# glspinner
SpinnerEddy's tool made for practicing WebGL

# 使い方
他プロジェクトから利用する場合:
```
npm install github:SpinnerEddy/glspinner#main
```
- 更新は`npm update glspinner`（最新コミットを取得しビルドし直す）
- GUI/録画機能（`src/tools.ts`）を使う場合は`lil-gui`/`jszip`も別途インストールが必要
- バージョンを固定したい場合は`#main`をコミットハッシュやタグに置き換える

# 次やること
- マテリアルとジオメトリの精査と関係性の調整
- 立方体など描けるジオメトリの種類を増やす
- ライティング

# その後
- インスタンシング

# 課題
- UBOの情報のまとめ方がこれで良いかを再考したい
- MIDIコントローラーの扱い
    - チャンネルの定義、操作時に実行する処理の紐づけ、LED制御などの設計を固めきれてない

# 依存
- GUI/録画機能（`src/tools.ts`）を使う場合は`lil-gui`/`jszip`が別途必要（`peerDependencies`）

# License
MIT