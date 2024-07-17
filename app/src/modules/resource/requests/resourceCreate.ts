import { createResource } from '@vytex/client';
import { client } from '~/lib/client';
import type { Resource } from '~/schemas/core';

export async function createResourceRequest(resource: Resource) {
	return await client.request(createResource(resource));
}
