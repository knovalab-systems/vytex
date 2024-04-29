/// <reference types="vitest" />
import path from 'node:path';
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom',
		// isolate: false,
	},
	plugins: [solid()],
	server: {
		host: true,
		port: 4040,
	},
	build: {
		target: 'esnext',
	},
	resolve: {
		conditions: ['development', 'browser'],
		alias: {
			'~': path.resolve(__dirname, './src'),
		},
	},
});
