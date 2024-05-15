import { queryOptions } from '@tanstack/solid-query';
import { client } from '~/utils/client';

export async function loginRequest(username: string, password: string) {
	return await client.login(username, password);
}

export function refreshRequest(enabled: boolean) {
	return queryOptions({
		queryFn: async () => await client.refresh(),
		queryKey: ['refresh', enabled],
		retry: false,
		enabled: enabled,
		refetchOnWindowFocus: false,
	});
}

export async function logoutRequest() {
	return await client.logout();
}
