import { client } from '~/utils/client';

export async function signOut() {
	return await client.logout();
}
