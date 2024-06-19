import { type Input, array, minLength, minValue, number, object, string } from 'valibot';
import { SizesSchema } from '~/schemas/sizesSchema';

export const ReferenceCreateSchema = object({
	reference: number('Ingresa el código de la referencia.', [minValue(0, 'Ingresa el código de la referencia.')]),
	colors: array(
		object({
			color: number('Selecciona un color.', [minValue(1, 'Selecciona un color.')]),
			resources: array(
				object({
					resource: string('Selecciona un insumo.', [minLength(1, 'Selecciona un insumo.')]),
					sizes: SizesSchema,
				}),
			),
		}),
	),
});

export type ReferenceCreateType = Input<typeof ReferenceCreateSchema>;
