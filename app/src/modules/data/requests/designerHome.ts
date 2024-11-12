import { queryOptions } from '@tanstack/solid-query';
import { aggregate } from '@vytex/client';
import { client } from '~/lib/client';

export function countColorsByStateQuery() {
	return queryOptions({
		queryKey: ['countColorsByState'],
		queryFn: () => countColorsByState(),
	});
}

async function countColorsByState() {
	return client.request(
		aggregate('vytex_colors', {
			aggregate: {
				count: ['id', 'deleted_at'],
			},
		}),
	);
}

export type CountColorsByStateType = Awaited<ReturnType<typeof countColorsByState>>;

export function countResourceByStateQuery() {
	return queryOptions({
		queryKey: ['countResourceByState'],
		queryFn: () => countResourceByState(),
	});
}

async function countResourceByState() {
	return client.request(
		aggregate('vytex_resources', {
			aggregate: {
				count: ['id', 'deleted_at'],
			},
		}),
	);
}

export type CountResourceByStateType = Awaited<ReturnType<typeof countResourceByState>>;

export function countFabricsByStateQuery() {
	return queryOptions({
		queryKey: ['countFabricsByState'],
		queryFn: () => countFabricsByState(),
	});
}

async function countFabricsByState() {
	return client.request(
		aggregate('vytex_fabrics', {
			aggregate: {
				count: ['id', 'deleted_at'],
			},
		}),
	);
}

export type CountFabricsByStateType = Awaited<ReturnType<typeof countFabricsByState>>;

export function countReferencesByStateQuery() {
	return queryOptions({
		queryKey: ['countReferencesByState'],
		queryFn: () => countReferencesByState(),
	});
}

async function countReferencesByState() {
	return client.request(
		aggregate('vytex_references', {
			aggregate: {
				count: ['id', 'deleted_at'],
			},
		}),
	);
}

export type CountReferencesByStateType = Awaited<ReturnType<typeof countReferencesByState>>;
