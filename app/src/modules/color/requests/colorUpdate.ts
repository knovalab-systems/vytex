import { updateColor } from '@vytex/client';
import { client } from '~/lib/client';
import type { Color } from '~/schemas/core';

export async function updateColorRequest(id: number, color: Color) {
	return await client.request(updateColor(id, color));
}
