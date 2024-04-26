import { client } from '~/utils/client';

export async function signIn(username: string, password: string) {
	return await client.login(username, password);
}
