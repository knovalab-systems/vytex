import type { ClientGlobals, ClientOptions, VytexClient } from './types/client';

/**
 * The default globals supplied to the client
 */
const defaultGlobals: ClientGlobals = {
	fetch: globalThis.fetch,
	URL: globalThis.URL,
	logger: globalThis.console,
};

/**
 * Creates a client to communicate with Vytex API.
 *
 * @param url The URL to the Vytex API.
 * @param options The optional configuration.
 *
 * @returns A Vytex client.
 */

export const createVytexClient = <Schema = any>(url: string, options: ClientOptions = {}): VytexClient<Schema> => {
	const globals = options.globals ? { ...defaultGlobals, ...options.globals } : defaultGlobals;
	return {
		globals,
		url: new globals.URL(url),
		with(createExtension) {
			return {
				...this,
				...createExtension(this),
			};
		},
	};
};
