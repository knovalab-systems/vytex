import { defineConfig } from 'cypress';

export default defineConfig({
	env: {
		baseUrl: 'http://localhost:4040',
		login: 'http://localhost:4040/login',
		customs: 'http://localhost:4040/customs',
	},
	e2e: {
		setupNodeEvents(on, config) {
			config.baseUrl = config.env.baseUrl;
			config.viewportWidth = 1920;
			config.viewportHeight = 1080;

			return config;
		},

		// Enable cypress studio
		experimentalStudio: true,
		watchForFileChanges: true,
	},
});
