import { type VytexRole, updateRole } from '@vytex/client';
import { client } from '~/lib/client';

export async function updateRoleRequest(id: string, role: Partial<VytexRole>) {
	return await client.request(updateRole(id, role));
}
