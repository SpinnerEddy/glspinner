---
name: glspinner-linter
description: glspinnerプロジェクトにESLint+Prettierを導入し、.claude/rules/配下に人力で言語化されているコーディング規約（命名規則・インデント・クォート・セミコロン等）を、可能な範囲で自動検査・自動整形できるルールへ落とし込む。「ESLintを入れて」「Prettierの設定を作って」「lintの設定をして」「コードスタイルを統一したい」「フォーマッターを導入したい」「リンターを設定して」「コードの書き方がバラバラなので揃えたい」といった依頼が来たら必ずこのスキルを使う。既存のリポジトリにはESLint/Prettierの設定が無く、CLAUDE.mdや.claude/rules/general.mdにも「lint/format系のコマンドは無い」と明記されているため、このスキルを実行した後はそれらのドキュメントの更新も忘れずに検討すること。
---

# glspinner-linter

## このスキルの立ち位置

glspinnerには`.eslintrc`も`.prettierrc`も無く、コーディング規約は`.claude/rules/`配下に**人力で文書化されているだけ**（`glspinner-conventions`スキルの管轄）。このスキルはその文書化された規約のうち、機械的に検査・整形できる部分をESLint（コード品質・命名規則）とPrettier（フォーマット）の設定として実際に導入し、「書いてあるだけ」から「保存時に検査/整形される」状態に格上げする。

`.claude/rules/`の**内容を書く**のは`glspinner-conventions`、その内容を**ツールとして実行可能にする**のがこのスキル、という役割分担。このスキル自身は`.claude/rules/`配下のファイルを直接編集しない（規約ドキュメントの一次情報源は`glspinner-conventions`に委ねる）。

## 前提: 既に決まっている設計判断

このプロジェクトのオーナーと相談した結果、以下が既定方針になっている。新規にこのスキルを実行する際、`.claude/rules/general.md`の内容が下記と食い違っていないか（規約が更新されていないか）を先に確認し、食い違いがあれば下記をそのまま使わずユーザーに確認すること。

1. **ツール構成**: ESLint（コード品質・命名規則）+ Prettier（フォーマット）の組み合わせ。`eslint-plugin-prettier`（PrettierをESLintルールとして実行する方式）は使わず、`eslint-config-prettier`でESLint側のフォーマット系ルールを無効化した上でPrettierは別コマンドとして走らせる、という現在推奨されている構成にする。
2. **`.claude/rules/general.md`「未解決・揺れがある事項」の扱い**: ドキュメント化済みの揺れ（`==`/`===`混在、`public`修飾子の明示/省略混在など）は、**プロジェクト全体を書き換えさせる方向には倒さず、現状の多数派に合わせてルール側を緩める**。等価比較演算子は`eqeqeq`ルールを無効化（`==`/`===`どちらも許容）。インデント4スペース・セミコロンありは元々多数派なので、これはPrettier側でそのまま強制してよい（少数の例外ファイルだけ整形されることになるが、意味を変えない機械的整形なので問題ない）。
3. **クォートスタイル**: `general.md`は「importパスは二重引用符、それ以外は単一引用符」という使い分けを記録しているが、ESLint/Prettierの標準的なquoteルールはこの区別を再現できない（import文字列だけを特別扱いする一般的な設定項目が無い）。オーナーの判断で**シングルクォートに統一**することになっている。つまりPrettier適用後、既存のimport文（`import { Foo } from "../bar"`）はシングルクォートへ書き換わる対象になる。これは意図的な仕様変更であり、バグではない。
4. **命名規則**: `general.md`「命名規則」に明記されている「クラス名はPascalCase」「boolean値は`is`/`has`接頭辞」「private/protectedにアンダースコア接頭辞を使わない」は`@typescript-eslint/naming-convention`で検査対象にする。ただし明示的に定義したselector以外（ローカル変数・enumメンバー等、規約に明記の無いもの）は対象にせず、誤検知を増やさない。
5. **初回セットアップの範囲**: 設定ファイルの生成とnpm scriptsの追加のみ行い、既存コード全体への一括`--fix`はこのスキルの範囲外（別途ユーザーに確認してから行う）。理由は、`.claude/rules/`に文書化されている「意図的な例外」（例: `UnlitMesh.ts`のタブ混入1箇所、`throw`直後のセミコロン抜け）が一括fixで一律書き換わってしまうと、それが「意図的だった」のか「今回のfixで直った」のかドキュメントと食い違ってしまうため。一括整形をする場合は、`.claude/rules/general.md`の「未解決・揺れがある事項」を先に更新してから行うほうが安全。
6. **Markdown（`*.md`）はフォーマット対象外**: `assets/prettierignore`で`*.md`/`**/*.md`を除外している。Prettierはデフォルトで`README.md`・`.claude/rules/`配下・`.claude/skills/*/SKILL.md`・`claude_io/`配下のような文書ファイルも整形対象に含めてしまうが、このプロジェクトで「フォーマットを揃えたい」という要望は一貫して**コードに関係する部分**（`.ts`/`.json`/`.mjs`等の設定ファイル）を指しており、ドキュメント文面の改行・箇条書きの体裁まで一括で書き換えるのは意図しない副作用になる。新規に`.prettierignore`を調整する場合もこの除外は維持すること。
7. **`printWidth`は200**: オーナーから「コンストラクタ等で引数リストを複数行に折り返した際、最後の引数の直後に`)`を続けたい（`)`だけの行を作りたくない）」という要望があったが、Prettierにはこの折り返しスタイルを制御するオプションが存在しない（`--print-width`はあるが、折り返した場合の閉じ括弧の位置自体は常に独立した行になる、というPrettier側の固定仕様）。代替として、`general.md`に元々「1行の長さの明確な上限ルールは見当たらない、長めのメソッドシグネチャも折り返さず1行に収めている」と記録されている観察と平仄を合わせる形で`printWidth`を200まで引き上げ、現実的な長さの関数シグネチャでは折り返し自体が発生しないようにした（デフォルトの80はもちろん、80〜120程度でも`Camera`のコンストラクタのような3引数程度のシグネチャがすぐ複数行に割れてしまう）。これでも収まらないほど長い引数リストは依然として複数行に折り返され、その場合は閉じ括弧が独立した行になる制約は残る。

## 手順

### 1. 現状確認

- `.claude/rules/general.md`の「フォーマット」「命名規則」「未解決・揺れがある事項」を読み、上記の前提と食い違いがないか確認する。
- `package.json`に既にlint/format関連の設定（`eslint`, `prettier`関連のdevDependenciesやscripts）が無いか確認する。既にある場合は新規導入ではなく改修になるので、このスキルの前提が成り立たない可能性がある——その場合はユーザーに状況を確認する。
- `node -v` / `npx tsc -v`でNode.js・TypeScriptのバージョンを確認する。ESLint 9系のflat config（`eslint.config.mjs`）はNode 18.18以降が前提。古い場合はESLint 8系+`.eslintrc`形式に切り替える必要があるためユーザーに確認する。

### 2. 依存関係のインストール

以下を`devDependencies`に追加する（バージョンは固定せず、実行時点の最新安定版をnpmに解決させる）:

```bash
npm install -D eslint @eslint/js typescript-eslint eslint-config-prettier prettier
```

### 3. 設定ファイルの配置

このスキルの`assets/`配下にある3ファイルをリポジトリルートへコピーする（内容は前提のセクションで決めた方針を反映済みなので、基本的にそのまま使ってよい）:

- `assets/eslint.config.mjs` → リポジトリルートの`eslint.config.mjs`
- `assets/prettierrc.json` → リポジトリルートの`.prettierrc.json`（ドットファイル名に変更することに注意。`assets/`配下では`.`始まりのファイル名を避けるため`prettierrc.json`という名前にしてある）
- `assets/prettierignore` → リポジトリルートの`.prettierignore`（同様に`.`を付ける）

`eslint.config.mjs`の拡張子を`.mjs`にしているのは、`package.json`に`"type": "module"`が無い（デフォルトでCommonJS扱い）ため、ESM構文の設定ファイルを`.js`のまま置くと解釈エラーになるのを避けるため。`package.json`に`"type": "module"`を追加する変更は他の設定ファイル（`vite.config.ts`等）への影響が読み切れないため、このスキルでは行わない。

コピー後、リポジトリの現状に合わせて調整が必要な点がないか目視で確認する（例: 新しいビルド出力ディレクトリが増えていないか、`examples/`配下に生成物が増えていないか等）。

### 4. npm scriptsの追加

`package.json`の`scripts`に以下を追加する（既存のスクリプトの並び・書式に合わせる）:

```json
"lint": "eslint .",
"lint:fix": "eslint . --fix",
"format": "prettier --write .",
"format:check": "prettier --check ."
```

### 5. 動作確認（既存コードへのfixはしない）

```bash
npm run lint
npm run format:check
```

これらを実行し、エラーなく設定自体が機能すること（構文エラーやparserOptions関連のエラーが出ないこと）を確認する。既存コードに対する違反件数（`npm run lint`の警告数、`prettier --check`が「整形が必要」と報告するファイル数）はそのまま報告するだけに留め、`--fix`や`--write`は前提4で述べた理由により自動実行しない。

もし`npm run lint`が大量のparserOptions関連エラー（「このファイルはどのtsconfigのprojectにも含まれていない」等）を出す場合、`eslint.config.mjs`が型情報を必要とするルール（`parserOptions.project`を要求するもの）を使っていないか確認する。このスキルの既定設定は意図的に型情報を使わない軽量なlintに留めている（`tsconfig.json`の`include`が`src`と一部の`examples`ファイルしかカバーしておらず、`tests/`や`examples/`全体を含む型認識lintをやろうとすると`tsconfig`側の整備が別途必要になるため）。型認識ルール（`no-floating-promises`等）を追加したい場合は、対象ファイル全体をカバーするtsconfigの整備とセットで、別途ユーザーと相談してから行う。

### 6. ドキュメントの整合性についてユーザーに確認する

このスキル実行後、以下のドキュメントの記述が事実と食い違う状態になる:

- `.claude/CLAUDE.md`「ESLint/Prettierの設定は無く、lint/formatスクリプトも無い。スタイルは規約（後述）でのみ担保されている」
- `.claude/rules/general.md`「glspinnerには`.eslintrc`も`.prettierrc`も存在せず...自動整形・自動検査による強制力は一切なく」
- `package.json`のscripts一覧に言及している`.claude/CLAUDE.md`のコマンド一覧（7スクリプトのみ、という記述）

これらは`.claude/rules/`と`CLAUDE.md`の一次情報源を管理する`glspinner-conventions`スキルの担当領域なので、このスキル自身では編集せず、**セットアップ完了後にユーザーへ「`glspinner-conventions`でドキュメントを更新しますか」と確認する**。ここを放置すると、以後の`glspinner-tidy`（規約に沿った手動整形）や他のSKILLが「lintツールは無い」という古い前提のまま動いてしまう。

## 完了後の報告

- 追加した依存関係・設定ファイル・npm scriptsを簡潔に列挙する。
- `npm run lint`・`npm run format:check`の結果（違反件数の概要）を報告する。全件を貼り付ける必要はない。
- ドキュメント更新（`glspinner-conventions`への引き継ぎ）をするかどうかユーザーに確認する。
