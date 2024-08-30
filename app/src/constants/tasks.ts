import type { TimeByTask } from '~/types/core';

export const TASKS: Array<string> = [
	'trazar',
	'plantear',
	'tender',
	'cortar',
	'paquetear',
	'filetear',
	'armar',
	'tapar',
	'figurar',
	'marquilla',
	'cerrar',
	'gafetes',
	'presillar',
	'pulir',
	'revisar',
	'acabados',
	'bolsas',
	'tiquetear',
	'empacar',
	'organizar',
	'grabar',
	'paletizar',
];

export const TASKS_RECORD: Record<keyof Omit<TimeByTask, 'id'>, { label: string }> = {
	trazar: {
		label: 'Trazar',
	},
	plantear: {
		label: 'Plantear',
	},
	tender: {
		label: 'Tender',
	},
	cortar: {
		label: 'Cortar',
	},
	paquetear: {
		label: 'Paquetear',
	},
	filetear: {
		label: 'Filetear',
	},
	armar: {
		label: 'Armar espalda',
	},
	tapar: {
		label: 'Tapar varilla',
	},
	figurar: {
		label: 'Figurar abrochadora',
	},
	marquilla: {
		label: 'Marquilla y sesgar',
	},
	cerrar: {
		label: 'Cerrar costado',
	},
	gafetes: {
		label: 'Gafetes y mangas',
	},
	presillar: {
		label: 'Presillar',
	},
	pulir: {
		label: 'Pulir',
	},
	revisar: {
		label: 'Revisar',
	},
	acabados: {
		label: 'Acabados',
	},
	bolsas: {
		label: 'Armado de bolsos',
	},
	tiquetear: {
		label: 'Tiquetear',
	},
	empacar: {
		label: 'Empacar',
	},
	organizar: {
		label: 'Organizar',
	},
	grabar: {
		label: 'Grabar',
	},
	paletizar: {
		label: 'Paletizar',
	},
};

export const DEFAULT_TIME_BY_TASK = {
	id: 1,
	...TASKS.reduce((p: Record<string, number>, v) => {
		p[v] = 0;
		return p;
	}, {}),
};
