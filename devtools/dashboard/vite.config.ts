import { defineConfig, loadEnv } from 'vite';
import { notionRelayPlugin } from './server/notion-relay-plugin';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [notionRelayPlugin(env)],
        server: {
            port: 5173
        }
    };
});
