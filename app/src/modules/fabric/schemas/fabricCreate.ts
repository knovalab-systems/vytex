import { type InferInput, minLength, minValue, number, object, pipe, string } from 'valibot';
import { CompositionsSchema } from '~/schemas/compositions';

export const FabricCreateSchema = object({
	name: pipe(string('Ingresa el nombre.'), minLength(1, 'Ingresa el nombre.')),
	code: pipe(number('Ingresa el código.'), minValue(1, 'Ingresa el código.')),
	cost: pipe(number('Ingresa el costo.'), minValue(1, 'Ingresa un costo mayor a 0.')),
	color: pipe(number('Selecciona un color.'), minValue(1, 'Selecciona un color.')),
	supplier: pipe(number('Selecciona un proveedor.'), minValue(1, 'Selecciona un proveedor.')),
	composition: CompositionsSchema,
});

export type FabricCreateType = InferInput<typeof FabricCreateSchema>;
