import type { MergeCoreCollection } from '../index.js';

/**
 * vytex_compositions type
 * number fields (except id) range from 0 to 10000
 */
export type VytexComposition<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_compositions',
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
