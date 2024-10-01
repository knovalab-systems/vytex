import type { MergeCoreCollection } from '../index.js';
import type { VytexStep } from './index.js';

/**
 * vytex_tasks type
 */
export type VytexTask<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_tasks',
	{
		id: number;
		value: TaskValue;
		name: string;
		step_id: number;
		step: VytexStep<Schema>;
	}
>;

export type TaskValue =
	| 'trazar'
	| 'plantear'
	| 'tender'
	| 'cortar'
	| 'paquetear'
	| 'filetear'
	| 'armar espalda'
	| 'tapar varilla'
	| 'figurar abrochadura'
	| 'cerrar costado'
	| 'marquilla y sesgar'
	| 'gafete y mangas'
	| 'presillar'
	| 'pulir'
	| 'revisar'
	| 'acabados'
	| 'bolsas'
	| 'tiquetear'
	| 'empacar'
	| 'organizar'
	| 'grabar'
	| 'paletizar';
