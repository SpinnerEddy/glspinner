import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
    { ignores: ['dist/**'] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts'],
        rules: {
            // glspinnerは==/!=と===/!==が混在しており、.claude/rules/general.mdで
            // 「厳密な規約ではない」と明記されているドキュメント済みの揺れのため、
            // eqeqeqは意図的に有効化しない。将来この揺れが解消されたら見直すこと。
            eqeqeq: 'off',

            // noUnusedLocals/noUnusedParametersはtsconfig.json側でも有効だが、
            // エディタのESLint表示にも出したいので併せて有効化する。
            // "_"始まりの引数は、DeviceOperation等インターフェース契約上必須だが
            // 実装内で未使用な引数を示す既存の書き方(MidiDevice.ts等)を許可する。
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],

            // .claude/rules/general.mdの命名規則を反映。
            // ここで明示的に定義したselector以外(通常の変数・enumメンバー等)は
            // 未規定のまま強制しない。
            '@typescript-eslint/naming-convention': [
                'warn',
                { selector: 'class', format: ['PascalCase'] },
                { selector: 'interface', format: ['PascalCase'] },
                { selector: 'typeAlias', format: ['PascalCase'] },
                { selector: 'method', format: ['camelCase'] },
                {
                    selector: ['classProperty', 'classMethod', 'accessor'],
                    modifiers: ['private', 'protected'],
                    format: ['camelCase'],
                    leadingUnderscore: 'forbid',
                },
                // boolean値のis/has接頭辞チェックは`types: ['boolean']`の絞り込みが
                // 型情報(parserOptions.project)を要求するため、非型認識lintという
                // 方針(前提5参照)と矛盾する。型認識lintを別途導入しない限り対象外。
            ],
        },
    },
    eslintConfigPrettier,
);
