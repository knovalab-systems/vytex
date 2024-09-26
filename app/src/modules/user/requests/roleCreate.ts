import { type VytexRole, createRole } from '@vytex/client';
import { client } from '~/lib/client';

export async function createRoleRequest(role: Partial<VytexRole>) {
	return await client.request(createRole(role));
}
