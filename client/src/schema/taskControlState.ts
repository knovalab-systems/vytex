import type { MergeCoreCollection } from '../index.js';

/**
 * vytex_task_control_status type
 */
export type VytexTaskControlState<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_orders-status',
	{
		id: number;
		name: string;
		value: TaskControlStateValue;
	}
>;

export type TaskControlStateValue = 'created' | 'started' | 'finished' | 'rejected';
