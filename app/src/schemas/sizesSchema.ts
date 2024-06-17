import { type Input, minValue, number, object } from 'valibot';

const ERROR_TEXT = 'Ingresa un valor igual o mayor a 0.';

export const SizesSchema = object({
	'2xs': number(ERROR_TEXT, [minValue(0, ERROR_TEXT)]),
	xs: number(ERROR_TEXT, [minValue(0, ERROR_TEXT)]),
	s: number(ERROR_TEXT, [minValue(0, ERROR_TEXT)]),
	m: number(ERROR_TEXT, [minValue(0, ERROR_TEXT)]),
	l: number(ERROR_TEXT, [minValue(0, ERROR_TEXT)]),
	xl: number(ERROR_TEXT, [minValue(0, ERROR_TEXT)]),
	'2xl': number(ERROR_TEXT, [minValue(0, ERROR_TEXT)]),
	'3xl': number(ERROR_TEXT, [minValue(0, ERROR_TEXT)]),
	'4xl': number(ERROR_TEXT, [minValue(0, ERROR_TEXT)]),
	'5xl': number(ERROR_TEXT, [minValue(0, ERROR_TEXT)]),
	'6xl': number(ERROR_TEXT, [minValue(0, ERROR_TEXT)]),
	'7xl': number(ERROR_TEXT, [minValue(0, ERROR_TEXT)]),
	'8xl': number(ERROR_TEXT, [minValue(0, ERROR_TEXT)]),
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

export type SizesType = Input<typeof SizesSchema>;

export const defaultSizeSchema = SIZES.reduce<SizesType>((p: SizesType, v) => {
	p[v] = 0;
	return p;
}, {} as SizesType);
