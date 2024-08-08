import { defineConfig } from 'tsup';

const env = process.env.NODE_ENV;

export default defineConfig({
	target: 'es2020',
	splitting: false, // Split output into chunks
	treeshake: true, // Remove unused code
	clean: true, // clean dist before build
	dts: true, // generate dts file for main module
	minify: env === 'production',
	bundle: true,
	sourcemap: env === 'production',
	watch: env === 'development',
	format: ['esm'], // generate esm files
	outDir: 'dist', // Output directory
	entry: ['src/index.ts', 'src/auth/index.ts', 'src/rest/index.ts'],
});
