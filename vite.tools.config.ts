import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    build: {
        outDir: path.resolve(__dirname, 'dist'),
        emptyOutDir: false,
        lib: {
            entry: path.resolve(__dirname, 'src/tools.ts'),
            name: 'spinnerglTools',
            fileName: (format) => `spinnergl-lib.tools.${format}.js`,
            formats: ['es', 'cjs'],
        },
        rollupOptions: {
            external: ['lil-gui', 'jszip'],
        },
    },
});
