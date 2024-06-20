import { type InferInput, minValue, number, object, pipe } from 'valibot';

const ERROR_TEXT = 'Ingresa un valor igual o mayor a 0.';

export const SizesSchema = object({
	'2xs': pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
	xs: pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
	s: pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
	m: pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
	l: pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
	xl: pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
	'2xl': pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
	'3xl': pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
	'4xl': pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
	'5xl': pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
	'6xl': pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
	'7xl': pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
	'8xl': pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT)),
});

export const SIZES: Array<keyof SizesType> = [
	'2xs',
	'xs',
	's',
	'm',
	'l',
	'xl',
	'2xl',
	'3xl',
	'4xl',
	'5xl',
	'6xl',
	'7xl',
	'8xl',
];

export type SizesType = InferInput<typeof SizesSchema>;

export const defaultSizeSchema = SIZES.reduce<SizesType>((p: SizesType, v) => {
	p[v] = 0;
	return p;
}, {} as SizesType);
