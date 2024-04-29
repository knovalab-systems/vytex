import { client } from '~/utils/client';

export async function loginRequest(username: string, password: string) {
	return await client.login(username, password);
}
