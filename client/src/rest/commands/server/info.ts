import type { RestCommand } from '../../types.js';

export type ServerInfoOutput = {
	project: {
		project_name: string;
		default_language: string;
	};
	rateLimit?:
		| {
				points: number;
				duration: number;
		  }
		| false;
	rateLimitGlobal?:
		| {
				points: number;
				duration: number;
		  }
		| false;
	queryLimit?: {
		default: number;
		max: number;
	};
};

/**
 * Get information about the current installation.
 * @returns Information about the current installation.
 */
export const serverInfo =
	<Schema>(): RestCommand<ServerInfoOutput, Schema> =>
	() => ({
		method: 'GET',
		path: '/server/info',
	});
