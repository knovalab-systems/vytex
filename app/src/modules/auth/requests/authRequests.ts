import { client } from '~/utils/client';

export async function loginRequest(username: string, password: string) {
	return await client.login(username, password);
}

export async function refreshRequest(enabled: number) {
	if (enabled > 0) {
		return await client.refresh();
	}
	return Promise.reject('Ignore refresh');
}
