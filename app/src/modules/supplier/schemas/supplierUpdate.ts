import { type InferInput, check, minLength, minValue, number, object, picklist, pipe, string } from 'valibot';
import { STATUS_OPTIONS } from '~/constants/status';

export const SupplierUpdateSchema = object({
	name: pipe(string(), minLength(1, 'Ingresa el nombre.')),
	brand: pipe(string(), minLength(1, 'Ingresa la marca.')),
	code: pipe(number('Ingresa el código.'), minValue(1, 'Ingresa el código.')),
	nit: pipe(
		number('Ingresa el NIT.'),
		minValue(1, 'Ingresa el NIT.'),
		check(n => String(n).length === 9, 'El NIT debe ser de 9 dígitos'),
	),
	deleted_at: picklist<string[]>(Object.keys(STATUS_OPTIONS)),
});

export type SupplierUpdateType = InferInput<typeof SupplierUpdateSchema>;
