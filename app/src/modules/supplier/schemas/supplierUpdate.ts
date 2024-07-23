import { type InferInput, check, minLength, minValue, number, object, pipe, string } from 'valibot';

export const SupplierUpdateSchema = object({
	name: pipe(string(), minLength(1, 'Ingresa el nombre.')),
	brand: pipe(string(), minLength(1, 'Ingresa la marca.')),
	nit: pipe(
		number('Ingresa el NIT.'),
		minValue(1, 'Ingresa el NIT.'),
		check(n => String(n).length === 9, 'El NIT debe ser de 9 dígitos'),
	),
	code: pipe(number('Ingresa el código.'), minValue(1, 'Ingresa el código.')),
});

export type SupplierUpdateType = InferInput<typeof SupplierUpdateSchema>;
