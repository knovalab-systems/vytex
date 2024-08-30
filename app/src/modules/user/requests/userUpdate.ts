import { updateUser } from '@vytex/client';
import { client } from '~/lib/client';
import type { User } from '~/types/core';

export async function updateUserRequest(id: string, user: User) {
	return await client.request(updateUser(id, user));
}
