import type { MergeCoreCollection } from '../index.js';

/**
 * vytex_compositions type
 */
export type VytexTimeByTask<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_time-by-task',
	{
		id: number;
		algod: number;
		elast: number;
		lino: number;
		nylon: number;
		polye: number;
		rayon: number;
		rayvis: number;
		tencel: number;
		visco: number;
		hilom: number;
	}
>;
