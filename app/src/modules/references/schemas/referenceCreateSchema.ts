import { type Input, array, minLength, minValue, number, object, string } from 'valibot';
import { SizesSchema } from '~/schemas/sizesSchema';

export const ReferenceCreateSchema = object({
	reference: number('Ingresa el código de la referencia.', [minValue(0, 'Ingresa el código de la referencia.')]),
	colors: array(
		object({
			color: number([minValue(1, 'Selecciona el color de la referencia.')]),
			resources: array(
				object({
					resource: string([minLength(1, 'Selecciona un insumo.')]),
					sizes: SizesSchema,
				}),
			),
		}),
	),
});

export type ReferenceCreateType = Input<typeof ReferenceCreateSchema>;
