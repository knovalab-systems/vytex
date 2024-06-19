import { queryOptions } from '@tanstack/solid-query';
import { readColors, readFabrics, readResources } from '@vytex/client';
import { client } from '~/utils/client';

export function getColorsByRefCreateQuery() {
	return queryOptions({
		queryFn: getColorsByRefCreate,
		queryKey: ['getColorsByRefCreate'],
	});
}

async function getColorsByRefCreate() {
	return await client.request(
		readColors({
			limit: -1,
		}),
	);
}

export function getFabricsByRefCreateQuery() {
	return queryOptions({
		queryFn: getFabricsByRefCreate,
		queryKey: ['getFabricsByRefCreate'],
	});
}

async function getFabricsByRefCreate() {
	return await client.request(
		readFabrics({
			limit: -1,
		}),
	);
}

export function getResourcesByRefCreateQuery() {
	return queryOptions({
		queryFn: getResourcesByRefCreate,
		queryKey: ['getResourcesByRefCreate'],
	});
}

async function getResourcesByRefCreate() {
	return await client.request(
		readResources({
			limit: -1,
		}),
	);
}
