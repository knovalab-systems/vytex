import { client } from '~/utils/client';

export async function logoutRequest() {
	return await client.logout();
}
