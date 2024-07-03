import { type InferInput, minLength, object, pipe, string } from 'valibot';

export const ColorCreateSchema = object({
	name: pipe(string('Ingresa el nombre.'), minLength(1, 'Ingresa el nombre.')),
	code: pipe(string('Ingresa el código.'), minLength(1, 'Ingresa el código.')),
	hex: pipe(string('Ingresa el HEX.'), minLength(1, 'Ingresa el HEX.')),
});

export type ColorCreateType = InferInput<typeof ColorCreateSchema>;
