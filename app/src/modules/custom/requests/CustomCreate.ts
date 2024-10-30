import { queryOptions } from '@tanstack/solid-query';
import { createCustom, readReferences } from '@vytex/client';
import { client } from '~/lib/client';
import type { Custom } from '~/types/core';

export async function createCustomRequest(custom: Custom) {
	return await client.request(createCustom(custom));
}

export function getRefByCustomCreateQuery() {
	return queryOptions({
		queryFn: getRefByCustomCreate,
		queryKey: ['getRefByCustomCreate'],
	});
}

async function getRefByCustomCreate() {
	return await client.request(
		readReferences({
			limit: -1,
			fields: ['id', 'code', { colors: ['id', 'color_id'] }],
			filter: {
				deleted_at: {
					_null: true,
				},
			},
		}),
	);
}

export type RefByCustomCreate = Awaited<ReturnType<typeof getRefByCustomCreate>>;
