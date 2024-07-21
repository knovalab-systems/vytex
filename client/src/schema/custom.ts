import type { MergeCoreCollection, VytexUser } from '../index.js';

/**
 * vytex_customs type
 */
export type VytexCustom<Schema extends object> = MergeCoreCollection<
	Schema,
	'vytex_custom',
	{
		id: number;
		client: string | null;
		code: string | null;
		hex: string | null;
		deleted_at: string | null;
		finished_at: string | null;
		canceled_at: string | null;
		created_by: string | null;
		canceled_by: string | null;
		CreateUser: VytexUser<Schema[]> | null;
		CancelUser: VytexUser<Schema[]> | null;
	}
>;
