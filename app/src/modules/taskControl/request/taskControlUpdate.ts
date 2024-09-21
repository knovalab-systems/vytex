import { updateTaskControl } from '@vytex/client';
import { client } from '~/lib/client';
import type { TaskControl } from '~/types/core';

export async function updateTaskControlRequest(id: number, taskControl: Partial<TaskControl>) {
	return await client.request(updateTaskControl(id, taskControl));
}
