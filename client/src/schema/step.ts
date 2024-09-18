import type { MergeCoreCollection } from '../index.js';
import type { VytexTask } from './index.js';

/**
 * vytex_steps type
 */
export type VytexStep<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_steps',
	{
		id: number;
		value: StepValue;
		name: string;
		tasks: VytexTask<Schema>[];
	}
>;

export type StepValue = 'corte';
