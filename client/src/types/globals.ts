// biome-ignore lint/suspicious/noExplicitAny: using "| any" to ensure compatibility with various "Fetch" alternative function signatures
export type FetchInterface = (input: string | any, init?: RequestInit | any) => Promise<unknown>;

export type UrlInterface = typeof URL;

export type LogLevels = 'log' | 'info' | 'warn' | 'error';

export type ConsoleInterface = {
	// biome-ignore lint/suspicious/noExplicitAny: using "| any" to ensure compatibility with console
	[level in LogLevels]: (...args: any) => any;
};
