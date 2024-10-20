import type { MergeCoreCollection, VytexReference } from '../index.js';

export type VytexOperationalList<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_operational_list',
	{
		id: number;
		reference_id: number | null;
		reference: VytexReference<Schema> | null;
		operations: Operation<Schema>[] | null;
	}
>;

export type Operation<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_operation',
	{
		id: number;
		operational_list_id: number | null;
		operational_list: VytexReference<Schema> | null;
		description: string | null;
	}
>;
