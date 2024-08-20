import { type InferInput, minLength, minValue, number, object, picklist, pipe, string } from 'valibot';
import { STATUS_OPTIONS } from '~/constants/status';
import { CompositionsSchema } from '~/schemas/compositions';

export const FabricUpdateSchema = object({
	name: pipe(string('Ingresa el nombre.'), minLength(1, 'Ingresa el nombre.')),
	code: pipe(number('Ingresa el código.'), minValue(1, 'Ingresa el código.')),
	cost: pipe(number('Ingresa el costo.'), minValue(1, 'Ingresa un costo mayor a 0.')),
	color: pipe(number('Selecciona un color.'), minValue(1, 'Selecciona un color.')),
	supplier: pipe(number('Selecciona un proveedor.'), minValue(1, 'Selecciona un proveedor.')),
	deleted_at: picklist<string[], string>(Object.keys(STATUS_OPTIONS), 'Selecciona un estado.'),
	composition: CompositionsSchema,
});

export type FabricUpdateType = InferInput<typeof FabricUpdateSchema>;
