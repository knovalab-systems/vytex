import { updateUser } from '@vytex/client';
import { client } from '~/utils/client';
import type { User } from '../schemas/userSchema';

export async function updateUserRequest(id: string, user: User) {
	return await client.request(updateUser(id, user));
}
