import type { VytexSize } from '~/types/core';

export const SIZES: Array<keyof VytexSize> = [
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

export const DEFAULT_SIZES = SIZES.reduce(
	(p: Record<keyof VytexSize, number>, v) => {
		p[v] = 0;
		return p;
	},
	{} as Record<keyof VytexSize, number>,
);
