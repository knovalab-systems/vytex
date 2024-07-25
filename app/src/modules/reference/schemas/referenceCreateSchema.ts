import { type InferInput, array, minLength, minValue, number, object, pipe, string } from 'valibot';
import { SizesSchema } from '~/schemas/sizes';

export const ReferenceCreateSchema = object({
	code: pipe(number('Ingresa el código de la referencia.'), minValue(1, 'Ingresa un valor mayor a 0.')),
	colors: array(
		object({
			color: pipe(number('Selecciona un color.'), minValue(1, 'Selecciona un color.')),
			resources: array(
				object({
					resource: pipe(string('Selecciona un insumo/tela.'), minLength(1, 'Selecciona un insumo/tela.')),
					sizes: SizesSchema,
				}),
			),
		}),
	),
});

export type ReferenceCreateType = InferInput<typeof ReferenceCreateSchema>;
