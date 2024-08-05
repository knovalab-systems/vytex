import { updateResource } from '@vytex/client';
import { client } from '~/lib/client';
import type { Resource } from '~/schemas/core';

export async function updateResourceRequest(id: number, resource: Resource) {
	return await client.request(updateResource(id, resource));
}
