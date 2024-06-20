import { type InferInput, array, minLength, minValue, number, object, pipe, string } from 'valibot';
import { SizesSchema } from '~/schemas/sizesSchema';

export const ReferenceCreateSchema = object({
	reference: pipe(number('Ingresa el código de la referencia.'), minValue(0, 'Ingresa el código de la referencia.')),
	colors: array(
		object({
			color: pipe(number('Selecciona un color.'), minValue(1, 'Selecciona un color.')),
			resources: array(
				object({
					resource: pipe(string('Selecciona un insumo.'), minLength(1, 'Selecciona un insumo.')),
					sizes: SizesSchema,
				}),
			),
		}),
	),
});

export type ReferenceCreateType = InferInput<typeof ReferenceCreateSchema>;
