import { type InferInput, check, hexadecimal, minLength, minValue, number, object, pipe, string } from 'valibot';

export const ColorCreateSchema = object({
	name: pipe(string('Ingresa el nombre.'), minLength(1, 'Ingresa el nombre.')),
	code: pipe(number('Ingresa el código.'), minValue(1, 'Ingresa el código.')),
	hex: pipe(
		string('Ingresa el HEX.'),
		hexadecimal('Ingresa un valor válido de hexadecimal.'),
		check(e => e.length === 6 || e.length === 3, 'Ingresa solo 3 o 6 valores.'),
	),
});

export type ColorCreateType = InferInput<typeof ColorCreateSchema>;
