import { type InferInput, minLength, minValue, number, object, pipe, string } from 'valibot';
import { REQ_NAME } from '~/constants/commonErrMsgs';

export const ResourceCreateSchema = object({
	name: pipe(string(REQ_NAME), minLength(1, REQ_NAME)),
	code: pipe(string('Ingresa el código.'), minLength(1, 'Ingresa el código.')),
	cost: pipe(number('Ingresa el costo.'), minValue(1, 'Ingresa un costo mayor a 0.')),
	color: pipe(number('Selecciona un color.'), minValue(1, 'Selecciona un color.')),
	supplier: pipe(number('Selecciona un proveedor.'), minValue(1, 'Selecciona un proveedor.')),
});

export type ResourceCreateType = InferInput<typeof ResourceCreateSchema>;
