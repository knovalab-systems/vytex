import { createUser } from '@vytex/client';
import { client } from '~/lib/client';

export async function createUserRequest(name: string, username: string, password: string, roleId: string) {
	return await client.request(
		createUser({
			name: name,
			username: username,
			password: password,
			role: roleId,
		}),
	);
}
