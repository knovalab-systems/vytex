import { type InferInput, check, minLength, minValue, number, object, pipe, string } from 'valibot';

export const SupplierCreateSchema = object({
	name: pipe(string('Ingresa el nombre.'), minLength(1, 'Ingresa el nombre.')),
	code: pipe(number('Ingresa el código.'), minValue(1, 'Ingresa el código.')),
	brand: pipe(string('Ingresa la marca.'), minLength(1, 'Ingresa la marca.')),
	nit: pipe(
		number('Ingresa el NIT.'),
		minValue(1, 'Ingresa el NIT.'),
		check(n => String(n).length === 9, 'El NIT debe ser de 9 dígitos.'),
	),
});

export type SupplierCreateType = InferInput<typeof SupplierCreateSchema>;
