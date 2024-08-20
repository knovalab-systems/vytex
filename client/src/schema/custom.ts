import type { MergeCoreCollection, VytexUser } from '../index.js';
import type { VytexOrder } from './order.js';

/**
 * vytex_customs type
 */
export type VytexCustom<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_custom',
	{
		id: number;
		client: string | null;
		created_at: string | null;
		finished_at: string | null;
		canceled_at: string | null;
		created_by: string | null;
		canceled_by: string | null;
		create_user: VytexUser<Schema> | null;
		cancel_user: VytexUser<Schema> | null;
		orders: VytexOrder<Schema>[] | null;
	}
>;
