import type {
	CoreSchema,
	DeepPartial,
	VytexColor,
	VytexCustom,
	VytexFabric,
	VytexOrder,
	VytexReference,
	VytexResource,
	VytexSupplier,
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
export type Order = DeepPartial<VytexOrder<CoreSchema>>;
