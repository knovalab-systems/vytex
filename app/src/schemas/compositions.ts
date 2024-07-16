import { entriesFromList, maxValue, minValue, number, object, pipe } from 'valibot';

const REQ_VALUE = 'Ingresa un valor.';
const MIN_VALUE = 'Ingresa un valor igual o mayor a 0.';
const MAX_VALUE = 'Ingresa un valor igual o menor 100.';

export const COMPOSITIONS: Array<string> = [
	'algod',
	'elast',
	'lino',
	'nylon',
	'polye',
	'rayon',
	'rayvis',
	'tencel',
	'visco',
	'hilom',
];

export const CompositionsSchema = object(
	entriesFromList(COMPOSITIONS, pipe(number(REQ_VALUE), minValue(0, MIN_VALUE), maxValue(100, MAX_VALUE))),
);
