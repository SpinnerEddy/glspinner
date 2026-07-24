import dts from 'rollup-plugin-dts';

export default [
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/spinnergl-lib.d.ts',
            format: 'es',
        },
        plugins: [dts()],
    },
    {
        input: 'src/tools.ts',
        output: {
            file: 'dist/spinnergl-lib.tools.d.ts',
            format: 'es',
        },
        plugins: [dts()],
    },
];
