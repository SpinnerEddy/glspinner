import { defineConfig } from "vite";
import glsl from 'vite-plugin-glsl'

export default defineConfig({
    root:'/libs/src',
    base:'/',
    plugins: [
        glsl({
            include: /\.(glsl|vert|frag)$/,
        })
    ],
    resolve: {
        alias: {
            '@webgl': '/src/libs/src/webgl',
        },
    },
});