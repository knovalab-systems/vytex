import type { MergeCoreCollection } from '../index.js';
import type { VytexOrder, VytexTask } from './index.js';

/**
 * vytex_task-controls type
 */
export type VytexTaskControl<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_task-controls',
	{
		id: number;
		created_at: string;
		started_at: string;
		finished_at: string;
		rejected_at: string;
		task_id: number;
		task: VytexTask<Schema>;
		order_id: number;
		order: VytexOrder<Schema>;
		next_id: number | null;
		next: VytexTaskControl<Schema> | null;
		previous_id: number | null;
		previous: VytexTaskControl<Schema> | null;
	}
>;
