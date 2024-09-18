import type {
	CoreSchema,
	DeepPartial,
	VytexSize as VS,
	VytexColor,
	VytexComposition,
	VytexCustom,
	VytexFabric,
	VytexOrder,
	VytexOrderState,
	VytexPolicy,
	VytexReference,
	VytexResource,
	VytexSupplier,
	VytexTask,
	VytexTaskControl,
	VytexTimeByTask,
	VytexUser,
} from '@vytex/client';

// take from client
export type User = Partial<VytexUser<CoreSchema>>;
export type Color = Partial<VytexColor<CoreSchema>>;
export type Fabric = Partial<VytexFabric<CoreSchema>>;
export type Resource = Partial<VytexResource<CoreSchema>>;
export type Supplier = Partial<VytexSupplier<CoreSchema>>;
export type Reference = DeepPartial<VytexReference<CoreSchema>>;
export type Custom = DeepPartial<VytexCustom<CoreSchema>>;
export type Order = Partial<VytexOrder<CoreSchema>>;
export type Composition = VytexComposition<CoreSchema>;
export type TimeByTask = VytexTimeByTask<CoreSchema>;
export type VytexSize = VS;
export type OrderState = VytexOrderState<CoreSchema>;
export type Task = VytexTask<CoreSchema>;
export type TaskControl = VytexTaskControl<CoreSchema>;
export type Policy = VytexPolicy;
export type ResourceFabric = {
	fabrics: (VS & { fabric_id: number })[];
	resources: (VS & { resource_id: number })[];
};
