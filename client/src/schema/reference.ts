import type {
	MergeCoreCollection,
	VytexColor,
	VytexFabric,
	VytexImage,
	VytexResource,
	VytexSize,
	VytexTimeByTask,
	VytexUser,
} from '../index.js';

/**
 * vytex_reference type
 */
export type VytexReference<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_references',
	{
		id: number;
		code: string | null; // use for version purpose n erp interface
		front: string | null;
		front_image: VytexImage<Schema> | null;
		back: string | null;
		back_image: VytexImage<Schema> | null;
		deleted_at: string | null;
		created_at: string | null;
		created_by: string | null;
		user: VytexUser<Schema> | null;
		time_by_task_id: string | null;
		time_by_task: VytexTimeByTask<Schema> | null;
		colors: VytexColorByReference<Schema>[] | null;
		pieces: VytexImageByReference<Schema>[] | null;
	}
>;

export type VytexColorByReference<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_references',
	{
		id: number;
		reference_id: number | null;
		deleted_at: string | null;
		created_at: string | null;
		color_id: number | null;
		color: VytexColor<Schema> | null;
		reference: VytexReference<Schema> | null;
		fabrics: VytexFabricByReference<Schema>[] | null;
		resources: VytexResourceByReference<Schema>[] | null;
	}
>;

export type VytexImageByReference<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_references',
	{
		id: number;
		image_id: string | null;
		image: VytexImage<Schema> | null;
		reference_id: number | null;
		reference: VytexReference<Schema> | null;
	}
>;

export type VytexResourceByReference<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_references',
	{
		id: number;
		code: string | null;
		deleted_at: string | null;
		color_by_reference_id: number | null;
		resource_id: number | null;
		resource: VytexResource<Schema> | null;
	} & VytexSize
>;

export type VytexFabricByReference<Schema = any> = MergeCoreCollection<
	Schema,
	'vytex_references',
	{
		id: number;
		code: string | null;
		deleted_at: string | null;
		color_by_reference_id: number | null;
		fabric_id: number | null;
		fabric: VytexFabric<Schema> | null;
	} & VytexSize
>;
