import { updateFabric } from '@vytex/client';
import { client } from '~/lib/client';
import type { Fabric } from '~/types/core';

export async function updateFabricRequest(id: number, fabric: Partial<Fabric>) {
	return await client.request(updateFabric(id, fabric));
}
