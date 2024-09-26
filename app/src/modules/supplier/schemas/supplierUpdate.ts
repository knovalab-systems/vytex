import { type InferInput, check, minLength, minValue, number, object, picklist, pipe, string } from 'valibot';
import { REQ_NAME } from '~/constants/commonErrMsgs';
import { STATUS_OPTIONS } from '~/constants/status';

export const SupplierUpdateSchema = object({
	name: pipe(string(), minLength(1, REQ_NAME)),
	brand: pipe(string(), minLength(1, 'Ingresa la marca.')),
	code: pipe(number('Ingresa el código.'), minValue(1, 'Ingresa el código.')),
	nit: pipe(
		number('Ingresa el NIT.'),
		minValue(1, 'Ingresa el NIT.'),
		check(n => String(n).length === 9, 'El NIT debe ser de 9 dígitos.'),
	),
	deleted_at: picklist<string[], string>(Object.keys(STATUS_OPTIONS), 'Selecciona un estado.'),
});

export type SupplierUpdateType = InferInput<typeof SupplierUpdateSchema>;
