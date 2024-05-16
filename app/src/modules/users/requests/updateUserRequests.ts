import { updateUser } from '@vytex/client';
import { client } from '~/utils/client';
import type { user } from '../schemas/userSchema';

export async function updateRole(id: string, user: user) {
	return await client.request(updateUser(id, user));
}
