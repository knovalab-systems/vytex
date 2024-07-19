/// <reference types="vitest" />
import path from 'node:path';
import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';
import solid from 'vite-plugin-solid';

export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['**/*.test.tsx'],
		// mockReset: true,
		server: {
			deps: {
				inline: true,
			},
		},
		// if you have few tests, try commenting one
		// or both out to improve performance:
		// threads: false,
		// isolate: false,
		outputFile: 'test_results/components-report.html',
	},
	plugins: [solid(), compression({ algorithm: 'brotliCompress' })],
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
