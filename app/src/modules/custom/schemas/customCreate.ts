import { type InferInput, array, minLength, minValue, number, object, pipe, string } from 'valibot';
import { SizesSchema } from '~/schemas/sizes';

export const CustomCreateSchema = object({
	client: pipe(string('Ingrese el cliente.'), minLength(1, 'Ingrese el cliente.')),
	orders: array(
		object({
			colorByRef: pipe(number('Seleccione una referencia'), minValue(1, 'Selecciona una referencia')),
			sizes: SizesSchema,
		}),
	),
});

export type CustomCreateType = InferInput<typeof CustomCreateSchema>;
