import type { MergeCoreCollection } from '../index.js';

/**
 * vytex_order_status type
 */
export type VytexOrderState<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_orders-status',
	{
		id: number;
		name: string;
		value: OrderStateValue;
	}
>;

export type OrderStateValue =
	| 'created'
	| 'started'
	| 'finished'
	| 'canceled'
	| 'corte'
	| 'confeccion'
	| 'calidad'
	| 'empaque';
