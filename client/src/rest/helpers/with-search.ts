import type { RestCommand } from '../types.js';

export function withSearch<Schema, Output>(getOptions: RestCommand<Output, Schema>): RestCommand<Output, Schema> {
	return () => {
		const options = getOptions();

		if (options.method === 'GET') {
			options.method = 'SEARCH';
			options.body = JSON.stringify({ query: options.params });
			options.params = undefined;
		}

		return options;
	};
}
