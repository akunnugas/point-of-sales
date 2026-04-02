import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import instruckt from 'instruckt/vite'

export default defineConfig({
    server: {
        host: '0.0.0.0',
        hmr: {
            host: '10.10.10.10',
        },
    },
    plugins: [
        instruckt({ server: false, endpoint: '/instruckt', adapters: ['react', 'blade'], mcp: true }),
        {
            name: 'instruckt-build-shim',
            apply: 'build',
            resolveId(id) {
                if (id === 'virtual:instruckt') return '\0virtual:instruckt';
            },
            load(id) {
                if (id === '\0virtual:instruckt') return '';
            },
        },
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
});
