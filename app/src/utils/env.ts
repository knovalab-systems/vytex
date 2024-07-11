/**
 *
 * @param {string} name name of the env. var
 * @returns {string} value of the env. var
 */
function getEnvVar(name: string): string {
	const env = import.meta.env[name];
	if (!env) {
		throw new Error(`env variable "${name}" is not found`);
	}
	return env;
}
export const API_ENV = getEnvVar('VITE_API');
export const ADMIN_ROLE: string = getEnvVar('VITE_ADMIN_ROLE');
export const NO_ROLE: string = getEnvVar('VITE_NO_ROLE');
export const DESIGNER_ROLE: string = getEnvVar('VITE_DESIGNER_ROLE');
export const CLOUD_NAME: string = getEnvVar('VITE_CLOUDINARY_CLOUD_NAME');
export const CLOUD_PRESET: string = getEnvVar('VITE_CLOUDINARY_UPLOAD_PRESET');
export const CLOUD_API_KEY: string = getEnvVar('VITE_CLOUDINARY_APY_KEY');
