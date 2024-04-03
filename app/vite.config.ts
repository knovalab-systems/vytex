/// <reference types="vitest" />
import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom',
		// if you have few tests, try commenting one
		// or both out to improve performance:
		// threads: false,
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
	},
});
