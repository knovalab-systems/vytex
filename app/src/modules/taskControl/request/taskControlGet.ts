import { queryOptions } from '@tanstack/solid-query';
import { aggregate, readTaskControls } from '@vytex/client';
import { QUERY_LIMIT } from '~/constants/http';
import { client } from '~/lib/client';

export const getTaskControlsQueryKey = 'getTaskControls';

export function getTaskControlsQuery(page: number, tasks: number[]) {
	return queryOptions({
		queryKey: [getTaskControlsQueryKey, page, tasks],
		queryFn: () => getTaskControls(page, tasks),
		enabled: tasks.length > 0,
	});
}

function getTaskControls(page: number, tasks: number[]) {
	return client.request(
		readTaskControls({
			limit: QUERY_LIMIT,
			page: page,
			sort: ['-created_at', '-started_at', '-finished_at', '-rejected_at'],
			filter: {
				task_id: {
					_in: tasks,
				},
			},
			fields: [
				'id',
				'order_id',
				'finished_at',
				'created_at',
				'started_at',
				'rejected_at',
				'task_id',
				{ order: [{ color_by_reference: ['color_id', { reference: ['code'] }] }] },
			],
		}),
	);
}

export type GetTaskType = Awaited<ReturnType<typeof getTaskControls>>;

export function countTasksQuery(tasks: number[]) {
	return queryOptions({
		queryKey: ['countOrders', tasks],
		queryFn: () => countTasks(),
		enabled: tasks.length > 0,
	});
}

async function countTasks() {
	return await client.request(
		aggregate('vytex_task-controls', {
			aggregate: {
				count: '*',
			},
		}),
	);
}
