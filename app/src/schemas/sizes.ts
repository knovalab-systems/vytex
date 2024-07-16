import type { VytexFabricsBySize, VytexResourcesBySize } from '@vytex/client';
import { type InferInput, entriesFromList, minValue, number, object, pipe } from 'valibot';

const ERROR_TEXT = 'Ingresa un valor igual o mayor a 0.';
export const SIZES: Array<string> = ['2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL'];
export const SizesSchema = object(entriesFromList(SIZES, pipe(number(ERROR_TEXT), minValue(0, ERROR_TEXT))));

export type SizesType = InferInput<typeof SizesSchema>;

export const defaultSizeSchema = SIZES.reduce<SizesType>((p: SizesType, v) => {
	p[v] = 0;
	return p;
}, {} as SizesType);

export type ResourceFabric = {
	fabrics: VytexFabricsBySize[];
	resources: VytexResourcesBySize[];
};
