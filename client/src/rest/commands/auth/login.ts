import type { AuthenticationData } from '../../../index.js';
import type { RestCommand } from '../../types.js';

/**
 * Retrieve a temporary access token and refresh token.
 *
 * @param email Email address of the user you're retrieving the access token for.
 * @param password Password of the user.
 * @param options Optional login settings
 *
 * @returns The access and refresh tokens for the session
 */
export const login =
	<Schema>(email: string, password: string): RestCommand<AuthenticationData, Schema> =>
	() => {
		const data: Record<string, string> = { email, password };
		return { path: '/login', method: 'POST', body: JSON.stringify(data) };
	};
