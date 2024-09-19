import { queryOptions } from '@tanstack/solid-query';
import { readTaskControls } from '@vytex/client';
import { QUERY_LIMIT } from '~/constants/http';
import { client } from '~/lib/client';

export function getTasksQuery(page: number, tasks: number[]) {
	return queryOptions({
		queryKey: ['getOrders', page, tasks],
		queryFn: () => getTasks(page, tasks),
		enabled: tasks.length > 0,
	});
}

function getTasks(page: number, tasks: number[]) {
	return client.request(
		readTaskControls({
			limit: QUERY_LIMIT,
			page: page,
			filter: {
				task_id: {
					_in: tasks,
				},
			},
			fields: ['id', 'order_id', 'finished_at', 'created_at', 'started_at', 'rejected_at', 'task_id'],
		}),
	);
}

export type GetTaskType = Awaited<ReturnType<typeof getTasks>>;

export function countTasksQuery(tasks: number[]) {
	return queryOptions({
		queryKey: ['countOrders', tasks],
		queryFn: () => countTasks(),
		enabled: tasks.length > 0,
	});
}

async function countTasks() {
	return await Promise.resolve([{ count: 2 }]);
}
