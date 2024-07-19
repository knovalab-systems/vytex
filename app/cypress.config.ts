import { defineConfig } from 'cypress';

export default defineConfig({
	env: {
		baseUrl: 'http://localhost:4040',
	},
	e2e: {
		setupNodeEvents(on, config) {
			config.baseUrl = config.env.baseUrl;
			config.viewportWidth = 1280;
			config.viewportHeight = 720;

			return config;
		},

		// Enable cypress studio
		experimentalStudio: true,
	},
});
