import type { AuthenticationData } from '../../../index.js';
import type { RestCommand } from '../../types.js';

/**
 * Retrieve a new access token using a refresh token.
 *
 * @param mode Whether to retrieve the refresh token in the JSON response, or in a httpOnly secure cookie. One of json, cookie.
 * @param refresh_token The refresh token to use. If you have the refresh token in a cookie through /auth/login, you don't have to submit it here.
 *
 * @returns The new access and refresh tokens for the session.
 */
export const refresh =
	<Schema>(): RestCommand<AuthenticationData, Schema> =>
	() => ({
		path: '/refresh',
		method: 'POST',
	});
