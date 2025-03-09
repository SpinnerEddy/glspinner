import { defineConfig } from "vite";
import glsl from 'vite-plugin-glsl'

export default defineConfig({
    build: {
        lib: {
            entry: './src/index.ts',
            name: 'spinnergl',
            fileName: 'spinnergl-lib',
        }
    },
    server: {
        port: 2222
    },
    plugins: [
        glsl({
            include: /\.(glsl|vert|frag)$/,
        })
    ]
});