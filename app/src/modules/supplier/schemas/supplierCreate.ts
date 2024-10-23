import { type InferInput, check, minLength, minValue, number, object, pipe, string } from 'valibot';
import { REQ_NAME } from '~/constants/commonErrMsgs';

export const SupplierCreateSchema = object({
	name: pipe(string(REQ_NAME), minLength(1, REQ_NAME)),
	code: pipe(string('Ingresa el código.'), minLength(1, 'Ingresa el código.')),
	brand: pipe(string('Ingresa la marca.'), minLength(1, 'Ingresa la marca.')),
	nit: pipe(
		number('Ingresa el NIT.'),
		minValue(1, 'Ingresa el NIT.'),
		check(n => String(n).length === 9, 'El NIT debe ser de 9 dígitos.'),
	),
});

export type SupplierCreateType = InferInput<typeof SupplierCreateSchema>;
