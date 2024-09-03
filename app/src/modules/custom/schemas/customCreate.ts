import { type InferInput, array, entriesFromList, minLength, minValue, number, object, pipe, string } from 'valibot';
import { MIN_NUM_VALUE, REQ_NUM_VALUE_MSG } from '~/constants/commonErrMsgs';
import { SIZES } from '~/constants/sizes';

export const CustomCreateSchema = object({
	client: pipe(string('Ingrese el cliente.'), minLength(1, 'Ingrese el cliente.')),
	orders: array(
		object({
			colorByRef: pipe(number('Seleccione una referencia.'), minValue(1, 'Selecciona una referencia.')),
			sizes: object(entriesFromList(SIZES, pipe(number(REQ_NUM_VALUE_MSG), minValue(0, MIN_NUM_VALUE)))),
		}),
	),
});

export type CustomCreateType = InferInput<typeof CustomCreateSchema>;
