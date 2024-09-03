import type { MergeCoreCollection } from '../index.js';

/**
 * vytex_compositions type
 */
export type VytexTimeByTask<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_time-by-task',
	{
		id: number;
		trazar: number;
		plantear: number;
		tender: number;
		cortar: number;
		paquetear: number;
		filetear: number;
		armar: number;
		tapar: number;
		figurar: number;
		marquilla: number;
		cerrar: number;
		gafetes: number;
		presillar: number;
		pulir: number;
		revisar: number;
		acabados: number;
		bolsas: number;
		tiquetear: number;
		empacar: number;
		organizar: number;
		grabar: number;
		paletizar: number;
	}
>;
