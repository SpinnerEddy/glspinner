import { defineConfig } from 'vite';
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
            formats: ['es', 'cjs', 'umd'],
        },
        rollupOptions: {
            external: ['lil-gui', 'jszip'],
        },
    },
    server: {
        port: 2222,
        host: '127.0.0.1',
    },
    resolve: {
        alias: {
            '@webgl': path.resolve(__dirname, 'src/webgl'),
        },
    },
    plugins: [
        glsl({
            include: ['**/*.glsl', '**/*.vert', '**/*.frag'],
        }),
    ],
});
