import {
	type InferInput,
	array,
	entriesFromList,
	file,
	maxSize,
	mimeType,
	minLength,
	minValue,
	number,
	object,
	pipe,
	string,
} from 'valibot';
import { MIN_NUM_VALUE, REQ_NUM_VALUE } from '~/constants/commonErrMsgs';
import { SIZES } from '~/constants/sizes';

export const ReferenceCreateSchema = object({
	code: pipe(string('Ingresa el código.'), minLength(1, 'Ingresa el código.')),
	colors: array(
		object({
			color: pipe(number('Selecciona un color.'), minValue(1, 'Selecciona un color.')),
			resources: array(
				object({
					resource: pipe(string('Selecciona un insumo/tela.'), minLength(1, 'Selecciona un insumo/tela.')),
					sizes: object(entriesFromList(SIZES, pipe(number(REQ_NUM_VALUE), minValue(0, MIN_NUM_VALUE)))),
				}),
			),
		}),
	),
	front: pipe(
		file('Elije una imagen.'),
		mimeType(['image/jpeg', 'image/png', 'image/jpg', 'image/webp'], 'Formatos validos: jpeg, png, jpg, webp.'),
		maxSize(1024 * 1024 * 5, 'El tamaño máximo permitido es de 5MB.'),
	),
	back: pipe(
		file('Elije una imagen.'),
		mimeType(['image/jpeg', 'image/png', 'image/jpg', 'image/webp'], 'Formatos validos: jpeg, png, jpg, webp.'),
		maxSize(1024 * 1024 * 5, 'El tamaño máximo permitido es de 5MB.'),
	),
	pieces: array(
		object({
			piece: pipe(
				file('Elije una imagen.'),
				mimeType(['image/jpeg', 'image/png', 'image/jpg', 'image/webp'], 'Formatos validos: jpeg, png, jpg, webp.'),
				maxSize(1024 * 1024 * 5, 'El tamaño máximo permitido es de 5MB.'),
			),
		}),
	),
	operations: array(
		object({
			description: pipe(string('Ingresa una descripción.'), minLength(1, 'Ingresa la descripción de la operación.')),
		}),
	),
});

export type ReferenceCreateType = InferInput<typeof ReferenceCreateSchema>;
