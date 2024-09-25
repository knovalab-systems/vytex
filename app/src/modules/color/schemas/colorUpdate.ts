import {
	type InferInput,
	check,
	hexadecimal,
	minLength,
	minValue,
	number,
	object,
	picklist,
	pipe,
	string,
} from 'valibot';
import { REQ_NAME } from '~/constants/commonErrMsgs';
import { STATUS_OPTIONS } from '~/constants/status';

export const ColorUpdateSchema = object({
	name: pipe(string(), minLength(1, REQ_NAME)),
	code: pipe(number('Ingresa el código.'), minValue(1, 'Ingresa el código.')),
	hex: pipe(
		string('Ingresa el HEX.'),
		hexadecimal('Ingresa un valor válido de hexadecimal.'),
		check(e => e.length === 6 || e.length === 3, 'Ingresa solo 3 o 6 valores.'),
	),
	deleted_at: picklist<string[], string>(Object.keys(STATUS_OPTIONS), 'Selecciona un estado.'),
});

export type ColorUpdateType = InferInput<typeof ColorUpdateSchema>;
