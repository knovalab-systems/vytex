export const SIZES: Array<string> = ['2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL'];

export const DEFAULT_SIZES = SIZES.reduce((p: Record<string, number>, v) => {
	p[v] = 0;
	return p;
}, {});
