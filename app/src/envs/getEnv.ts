/**
 *
 * @param {string} name name of the env var
 * @returns {string} value of the env var
 */
export function getEnv(name: string): string {
	const env = import.meta.env[name];
	if (!env) {
		throw new Error(`env variable "${name}" is not found`);
	}
	return env;
}
