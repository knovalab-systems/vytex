import { type InferInput, minValue, number, object, pipe } from 'valibot';
import { SizesSchema } from '~/schemas/sizes';

export const OrderCreateSchema = object({
	colorByRef: pipe(number('Seleccione una referencia.'), minValue(1, 'Selecciona una referencia.')),
	sizes: SizesSchema,
});

export type OrderCreateType = InferInput<typeof OrderCreateSchema>;
