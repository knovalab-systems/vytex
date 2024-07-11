import { createColor } from '@vytex/client';
import type { Color } from '~/schemas/coreSchema';
import { client } from '~/lib/client';

export async function createColorRequest(color: Color) {
	return await client.request(createColor(color));
}
