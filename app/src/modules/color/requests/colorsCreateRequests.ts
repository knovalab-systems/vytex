import { createColor } from '@vytex/client';
import { client } from '~/lib/client';
import type { Color } from '~/schemas/coreSchema';

export async function createColorRequest(color: Color) {
	return await client.request(createColor(color));
}
