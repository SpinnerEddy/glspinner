---
name: glspinner-design
description: glspinnerで新しい機能・サブシステムを作る前に、既存アーキテクチャ（Operation+Baseパターン、RenderTag/Slotベースの疎結合設計など）との整合性を踏まえた設計案を作る。合意した設計のうち規約として残す価値があるものは.claude/rules/配下（glspinner-conventions管理）へ反映する。「◯◯を実装する前に設計を詰めたい」「このクラス構成でいい？」「どこにどう配置すべき」「既存のパイプラインにどう組み込む」といった、コードを書き始める前の設計相談を頼まれたら必ずこのスキルを使う。実装そのものを始める場合はglspinner-implementに引き継ぐ。
---

# glspinner-design

## このスキルの立ち位置

glspinnerには一貫した設計思想（`XxxOperation`インターフェース + `BaseXxx`抽象クラスの二層構造、Factory/Loaderによるキャッシュ、RenderTag/Slotベースの疎結合なリソース共有など。詳細は`.claude/rules/operation-base.md`と`.claude/rules/general.md`のディレクトリ構成と責務マップ）がある。新しい機能を作るとき、この思想を無視した設計をすると後で浮いた実装になる。このスキルは「実装に着手する前に、既存アーキテクチャに対してどう位置づけるかを決める」フェーズを担当する。

コードを書くこと自体はこのスキルの仕事ではない（それは`glspinner-implement`）。ここでのアウトプットは設計方針の合意と、必要なら`.claude/rules/`配下（該当ファミリーファイル、または新規ファミリーファイル）への反映まで。

## 実行手順

### 1. コンテキストダイジェストの取得

`/glspinner-context <対象トピック>` を実行し、関連する既存実装・適用すべき設計パターン・規約上の留意点を把握する。

### 2. 設計上の論点を洗い出す

対象がどのサブシステムに属するかに応じて、以下の観点で検討する（該当しないものは省略してよい）:

- **クラス構成**: 新規に`XxxOperation`インターフェース + `BaseXxx`抽象クラスを作るべきか、既存の具象クラスの一つとして追加すれば十分か。`.claude/rules/operation-base.md`の基準では、状態を持ちDI/モック差し替えの対象になりうる「差し替え可能なサブシステムの入口」（Application/Scene/Mesh/Material/Geometry/Buffer/RenderTarget/RendererFlow/ShaderPass/Device/Clock/Lightがこれまでの適用例）にのみ二層構造を適用し、静的メソッドだけのユーティリティや値の集合を定義するだけの`Constants`ファイルには適用しない。新規サブシステムがこの「差し替え可能な入口」に該当するかどうかで判断する。
- **どのレイヤーに置くか**: `scene/`配下のどのサブディレクトリか、あるいは`webgl/gl/`（低レベルラッパー）か`tools/`（GUI/ユーティリティ）か。既存の責務マップ（`.claude/rules/general.md`冒頭「ディレクトリ構成と責務マップ」）と矛盾しない置き場所を選ぶ。
- **既存の疎結合機構との接続**: レンダリング関連なら`RenderTag`・`RenderTargetRegistry`のスロット・`RendererContext`のグローバルUniformなど、既存の「宣言的に渡すだけで繋がる」仕組みに乗れないかを優先的に検討する（`.claude/rules/pipeline.md`/`render-target.md`参照）。新しい専用配線を増やすのは最後の手段。
- **Factory/Loaderへの登録要否**: マテリアル相当のものなら`MaterialFactory`、シェーダなら`ShaderLoader`のキャッシュ機構に乗せるべきか（乗せない場合はその理由を明記する。`.claude/rules/operation-base.md`「Factory/Loaderパターンとの関係」参照）。
- **未完成領域との関係**: `LightFactory`空ファイル（`.claude/rules/operation-base.md`「Light系」）、`CustomRenderTarget`のG-buffer拡張余地（`.claude/rules/render-target.md`）、`MidiDevice`未実装（`.claude/rules/device.md`）など、`.claude/rules/general.md`「気づきにくい挙動」に記録されている未完成領域に関連する設計なら、それらを前提にするか迂回するかを明示する。

### 3. 案を複数持つ場合はトレードオフを示す

一つの正解がない場合（例: 新規`BaseXxx`を作るか既存クラスを拡張するか）は、2〜3案に絞ってそれぞれの長所・短所を簡潔に示し、ユーザーと合意する。設計は後戻りのコストが実装より高いので、ここで決め切らずに次のフェーズに進まない。

### 4. `.claude/rules/`への反映

決まった設計が「今後この種のクラスを追加するときに従うべき規約」として残す価値があるかを判断する。価値がある場合は`glspinner-conventions`スキルの管轄である`.claude/rules/`配下（既存ファミリーファイルへの追記、または`operation-base.md`「パターンから外れる小規模ファミリー」節・新規ファミリーファイルの作成）に反映する。既存パターンをそのまま適用するだけの軽微な設計判断で、規約として書き残すほどの新規性がない場合は、無理に書き加えず口頭の合意で済ませてよい。

これから実装する機能そのものの実装メモ（この機能はこう作る、という一回限りの計画）は`.claude/rules/`の対象ではない——rulesは「既存コードに実際に宿っているパターン」を記録する場所であり、未実装の計画を書く場所ではない。実装が完了し、コードとして実在するパターンになった時点で初めて`.claude/rules/`へ反映する（`glspinner-implement`のフェーズ、または実装後にこのスキルへ戻って反映する）。

### 5. 完了後

設計方針が固まったら、実装に進むかどうかをユーザーに確認する。進む場合は`glspinner-implement`に引き継ぐ旨を伝える。
