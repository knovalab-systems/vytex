import { updateUser } from '@vytex/client';
import type { User } from '~/schemas/coreSchema';
import { client } from '~/lib/client';

export async function updateUserRequest(id: string, user: User) {
	return await client.request(updateUser(id, user));
}
