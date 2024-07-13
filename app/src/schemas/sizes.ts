import type { VytexFabricsBySize, VytexResourcesBySize } from '@vytex/client';
import { type InferInput, minValue, number, object, pipe } from 'valibot';

const ERROR_TEXT = 'Ingresa un valor igual o mayor a 0.';

export const SizesSchema = object({
	'2XS': pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
	XS: pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
	S: pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
	M: pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
	L: pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
	XL: pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
	'2XL': pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
	'3XL': pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
	'4XL': pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
	'5XL': pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
	'6XL': pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
	'7XL': pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
	'8XL': pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
});

export const SIZES: Array<keyof SizesType> = [
	'2XS',
	'XS',
	'S',
	'M',
	'L',
	'XL',
	'2XL',
	'3XL',
	'4XL',
	'5XL',
	'6XL',
	'7XL',
	'8XL',
];

export type SizesType = InferInput<typeof SizesSchema>;

export const defaultSizeSchema = SIZES.reduce<SizesType>((p: SizesType, v) => {
	p[v] = 0;
	return p;
}, {} as SizesType);

export type ResourceFabric = {
	fabrics: VytexFabricsBySize[];
	resources: VytexResourcesBySize[];
};
