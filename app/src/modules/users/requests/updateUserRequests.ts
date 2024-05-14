import { updateUser } from '@vytex/client';
import { client } from '~/utils/client';

export async function updateRole(id: string, role: string) {
	return await client.request(updateUser(id, { role: role }));
}
