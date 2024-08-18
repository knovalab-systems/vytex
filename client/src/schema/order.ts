import type { MergeCoreCollection, VytexColorByReference, VytexCustom, VytexSize, VytexUser } from '../index.js';

/**
 * vytex_customs type
 */
export type VytexOrder<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_orders',
	{
		id: number;
		status: StatusOrder | null;
		created_at: string | null;
		finished_at: string | null;
		canceled_at: string | null;
		created_by: string | null;
		canceled_by: string | null;
		color_by_reference_id: number | null;
		custom_id: number | null;
		color_by_reference: VytexColorByReference<Schema[]> | null;
		custom: VytexCustom<Schema[]> | null;
		create_user: VytexUser<Schema[]> | null;
		cancel_user: VytexUser<Schema[]> | null;
	} & VytexSize
>;

export type StatusOrder = 'Created';
