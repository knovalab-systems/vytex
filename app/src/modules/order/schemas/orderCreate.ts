import { type InferInput, entriesFromList, minValue, number, object, pipe } from 'valibot';
import { MIN_NUM_VALUE, REQ_NUM_VALUE } from '~/constants/commonErrMsgs';
import { SIZES } from '~/constants/sizes';

export const OrderCreateSchema = object({
	colorByRef: pipe(number('Seleccione una referencia.'), minValue(1, 'Seleccione una referencia.')),
	sizes: object(entriesFromList(SIZES, pipe(number(REQ_NUM_VALUE), minValue(0, MIN_NUM_VALUE)))),
});

export type OrderCreateType = InferInput<typeof OrderCreateSchema>;
