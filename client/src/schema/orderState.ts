import type { MergeCoreCollection } from '../index.js';

/**
 * vytex_customs type
 */
export type VytexOrderState<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_orders-status',
	{
		id: number;
		name: string;
		value: 'created' | 'started' | 'finished' | 'canceled';
	}
>;
