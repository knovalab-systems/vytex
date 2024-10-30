import { type InferInput, minLength, minValue, number, object, picklist, pipe, string } from 'valibot';
import { REQ_NAME } from '~/constants/commonErrMsgs';
import { STATUS_VALUES } from '~/constants/status';

export const ResourceUpdateSchema = object({
	name: pipe(string(REQ_NAME), minLength(1, REQ_NAME)),
	code: pipe(string('Ingresa el código.'), minLength(1, 'Ingresa el código.')),
	cost: pipe(number('Ingresa el costo.'), minValue(1, 'Ingresa un costo mayor a 0.')),
	color: pipe(number('Selecciona un color.'), minValue(1, 'Selecciona un color.')),
	supplier: pipe(number('Selecciona un proveedor.'), minValue(1, 'Selecciona un proveedor.')),
	deleted_at: picklist<string[], string>(STATUS_VALUES, 'Selecciona un estado.'),
});

export type ResourceUpdateType = InferInput<typeof ResourceUpdateSchema>;
