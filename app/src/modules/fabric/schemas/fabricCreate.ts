import { type InferInput, entriesFromList, maxValue, minLength, minValue, number, object, pipe, string } from 'valibot';
import { MIN_NUM_VALUE, REQ_NUM_VALUE_MSG } from '~/constants/commonErrMsgs';
import { COMPOSITIONS } from '~/constants/compositions';

export const FabricCreateSchema = object({
	name: pipe(string('Ingresa el nombre.'), minLength(1, 'Ingresa el nombre.')),
	code: pipe(number('Ingresa el código.'), minValue(1, 'Ingresa el código.')),
	cost: pipe(number('Ingresa el costo.'), minValue(1, 'Ingresa un costo mayor a 0.')),
	color: pipe(number('Selecciona un color.'), minValue(1, 'Selecciona un color.')),
	supplier: pipe(number('Selecciona un proveedor.'), minValue(1, 'Selecciona un proveedor.')),
	composition: object(
		entriesFromList(
			COMPOSITIONS,
			pipe(number(REQ_NUM_VALUE_MSG), minValue(0, MIN_NUM_VALUE), maxValue(100, 'Ingresa un valor igual o menor 100.')),
		),
	),
});

export type FabricCreateType = InferInput<typeof FabricCreateSchema>;
