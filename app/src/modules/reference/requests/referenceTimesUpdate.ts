import { updateTimesReference } from '@vytex/client';
import { client } from '~/lib/client';
import type { Reference } from '~/types/core';

export async function updateTimesRefenceRequest(id: number, reference: Reference) {
	return await client.request(updateTimesReference(id, reference));
}
