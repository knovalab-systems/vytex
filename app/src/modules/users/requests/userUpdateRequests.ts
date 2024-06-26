import { updateUser } from '@vytex/client';
import type { User } from '~/schemas/coreSchema';
import { client } from '~/utils/client';

export async function updateUserRequest(id: string, user: User) {
	return await client.request(updateUser(id, user));
}
