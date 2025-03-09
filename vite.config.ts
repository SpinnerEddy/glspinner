import { defineConfig } from "vite";
import glsl from 'vite-plugin-glsl';
import path from 'path';

export default defineConfig({
    root: 'examples',
    base: '/',
    build: {
        outDir: path.resolve(__dirname, 'dist'),
        emptyOutDir: true,
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'spinnergl',
            fileName: (format) => `spinnergl-lib.${format}.js`,
            formats: ['es', 'cjs', 'umd']
        },
    },
    server: {
        port: 2222
    },
    resolve: {
        alias: {
            '@webgl': path.resolve(__dirname, 'src/webgl')
        }
    },
    plugins: [
        glsl({
            include: ['**/*.glsl', '**/*.vert', '**/*.frag'],
        })
    ]
});