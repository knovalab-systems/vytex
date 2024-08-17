/**
 *
 * @param value
 * @param message
 * @throws Throws an error if the collection starts with the `vytex_` prefix
 */
export const throwIfCoreCollection = (value: string | number | symbol, message: string) => {
	if (String(value).startsWith('vytex_')) {
		throw new Error(message);
	}
};
