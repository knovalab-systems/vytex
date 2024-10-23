import { type InferInput, check, hexadecimal, minLength, object, pipe, string } from 'valibot';
import { REQ_NAME } from '~/constants/commonErrMsgs';

export const ColorCreateSchema = object({
	name: pipe(string(REQ_NAME), minLength(1, REQ_NAME)),
	code: pipe(string('Ingresa el código.'), minLength(1, 'Ingresa el código.')),
	hex: pipe(
		string('Ingresa el HEX.'),
		hexadecimal('Ingresa un valor válido de hexadecimal.'),
		check(e => e.length === 6 || e.length === 3, 'Ingresa solo 3 o 6 valores.'),
	),
});

export type ColorCreateType = InferInput<typeof ColorCreateSchema>;
