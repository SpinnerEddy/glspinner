import { defineConfig, loadEnv } from 'vite';
import { notionRelayPlugin } from './server/notion-relay-plugin';
import { localDocsRelayPlugin } from './server/docs-relay-plugin';
import { gitRelayPlugin } from './server/git-relay-plugin';
import { scriptsRelayPlugin } from './server/scripts-relay-plugin';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [notionRelayPlugin(env), localDocsRelayPlugin(), gitRelayPlugin(), scriptsRelayPlugin()],
        server: {
            port: 5173,
            host: '127.0.0.1'
        }
    };
});
