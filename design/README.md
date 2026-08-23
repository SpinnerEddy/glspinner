# glspinner 設計提案ドキュメント

`design/`配下は、glspinnerに対する**未実装の設計提案**を置く場所。既存の2つのドキュメント階層とは軸が異なる:

| 場所 | 軸 | 対象時点 |
|---|---|---|
| `docs/` | 「今、何が実装されているか」のスナップショット | 現在のソースコード |
| `.claude/rules/` | 「コードを書くときに従うべき規約」 | 現在のソースコードに宿っているパターン |
| `design/`（本フォルダ） | 「これから何を作るか」の設計提案 | 未来（未実装） |

`design/`配下の各ドキュメントは、実装が完了し次第そのドキュメント冒頭に実装済みである旨を追記し、内容を`docs/`（実装のスナップショット）と`.claude/rules/`（規約）へ反映する。反映が終わったら`design/`側は「実装済み・詳細は`docs/`参照」という短い記録として残すか、削除するかをその時点で判断する。

## ドキュメント一覧

| ドキュメント | 対象 | ステータス |
|---|---|---|
| [`render-graph.md`](render-graph.md) | `src/scene/renderer/`のレンダリングパイプラインをRender Graph化する設計 | 提案（未実装） |

## この設計提案の生まれた経緯

`SceneRendererPipeline`・`RenderTargetRegistry`・`~Flow`ファミリーの現状分析（アプリ側でのRenderTarget手動確保、read/writeのping-pongハードコード、RTスロットの静的事前登録という3つの症状）から出発し、`glspinner-design`スキルでの設計相談を経て合意した内容をまとめたもの。既存アーキテクチャ（`Operation`+`Base`パターン、RenderTag/Slotベースの疎結合設計、`.claude/rules/pipeline.md`/`flow.md`/`pass.md`/`render-target.md`）との接続点・移行範囲を検討済み。

## 新規ドキュメントの追加方法

以後、同種の設計提案（既存処理の改善案についての壁打ち→設計案の書き出し）は`glspinner-design-doc`SKILL（実体は`/glspinner-design-doc` command）で行う。手動でこのフォルダへファイルを追加した場合も、ドキュメント一覧表への追記を忘れないこと。
