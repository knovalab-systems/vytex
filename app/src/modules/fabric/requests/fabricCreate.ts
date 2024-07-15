import { createFabric } from '@vytex/client';
import { client } from '~/lib/client';
import type { Fabric } from '~/schemas/core';

export async function createFabricRequest(fabric: Fabric) {
	return await client.request(createFabric(fabric));
}
