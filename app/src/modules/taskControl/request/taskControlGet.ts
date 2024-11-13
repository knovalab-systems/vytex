import { queryOptions } from '@tanstack/solid-query';
import { aggregate, readReference, readTaskControls } from '@vytex/client';
import { QUERY_LIMIT } from '~/constants/http';
import { client } from '~/lib/client';
import type { TaskControlFilter } from '~/types/filter';

export const getTaskControlsQueryKey = 'getTaskControls';

export function getTaskControlsQuery(page: number, tasks: number[], filters: TaskControlFilter) {
	return queryOptions({
		queryKey: [getTaskControlsQueryKey, page, tasks, filters],
		queryFn: () => getTaskControls(page, tasks, filters),
		enabled: tasks.length > 0,
	});
}

function getTaskControls(page: number, tasks: number[], filters: TaskControlFilter) {
	return client.request(
		readTaskControls({
			limit: QUERY_LIMIT,
			page: page,
			sort: ['-created_at', '-started_at', '-finished_at', '-rejected_at'],
			...doFilters(tasks, filters),
			fields: [
				'id',
				'order_id',
				'finished_at',
				'created_at',
				'started_at',
				'rejected_at',
				'task_id',
				'task_control_state_id',
				{ order: [{ color_by_reference: ['color_id', { reference: ['id', 'code'] }] }] },
			],
		}),
	);
}

export type GetTaskType = Awaited<ReturnType<typeof getTaskControls>>;

export function countTasksQuery(tasks: number[], filters: TaskControlFilter) {
	return queryOptions({
		queryKey: ['countOrders', tasks, filters],
		queryFn: () => countTasks(tasks, filters),
		enabled: tasks.length > 0,
	});
}

async function countTasks(tasks: number[], filters: TaskControlFilter) {
	return await client.request(
		aggregate('vytex_task-controls', {
			aggregate: {
				count: '*',
			},
			query: {
				...doFilters(tasks, filters),
			},
		}),
	);
}

export function getReferenceQuery(key: number) {
	return queryOptions({
		queryKey: ['getReference', key],
		queryFn: () => getReference(key),
	});
}

async function getReference(key: number) {
	return await client.request(
		readReference(key, {
			fields: [
				'front',
				'created_at',
				'code',
				{
					colors: ['id', 'color_id', { fabrics: ['*'] }, { resources: ['*'] }],
				},
				'operations',
				'pieces',
			],
		}),
	);
}

export type GetReferenceType = Awaited<ReturnType<typeof getReference>>;

function doFilters(tasks: number[], filters: TaskControlFilter) {
	return {
		filter: {
			...(filters.id && {
				id: {
					_eq: filters.id,
				},
			}),
			...(filters.order && {
				order_id: {
					_eq: filters.order,
				},
			}),
			...(filters.status &&
				filters.status.length > 0 && {
					task_control_state_id: {
						_in: filters.status,
					},
				}),
			task_id: {
				_in: filters.tasks && filters.tasks.length > 0 ? filters.tasks : tasks,
			},
		},
	};
}
