import type { MergeCoreCollection } from '../index.js';

export type VytexRole<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_roles',
	{
		id: string;
		name: string | null;
		is_admin: boolean | null;
		static: boolean | null;
		policies: number[] | null;
	}
>;
