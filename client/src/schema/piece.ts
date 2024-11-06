import type { MergeCoreCollection, VytexImage } from '../index.js';

export type VytexPiece<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_pieces',
	{
		id: number;
		image_id: string | null;
		image: VytexImage<Schema> | null;
	}
>;
