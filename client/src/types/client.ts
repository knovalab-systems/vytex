import type { ConsoleInterface, FetchInterface, UrlInterface } from './globals';

/**
 * vytex client
 */
export interface VytexClient<Schema> {
	url: URL;
	globals: ClientGlobals;
	with: <Extension extends object>(createExtension: (client: VytexClient<Schema>) => Extension) => this & Extension;
}

/**
 * All used globals for the client
 */
export type ClientGlobals = {
	fetch: FetchInterface;
	URL: UrlInterface;
	logger: ConsoleInterface;
};

/**
 * Available options on the client
 */
export type ClientOptions = {
	globals?: Partial<ClientGlobals>;
};
