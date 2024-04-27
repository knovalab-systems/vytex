import { client } from '~/utils/client';

export async function singOut() {
	return await client.logout();
}
