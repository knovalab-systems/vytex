import type { VytexColor } from './color.js';
import type { VytexCustom } from './custom.js';
import type { VytexFabric } from './fabric.js';
import type { VytexImage } from './image.js';
import type { VytexOrder } from './order.js';
import type { VytexReference } from './reference.js';
import type { VytexResource } from './resource.js';
import type { VytexSupplier } from './supplier.js';
import type { VytexUser } from './user.js';

export interface CoreSchema<Schema = any> {
	vytex_users: VytexUser<Schema>[];
	vytex_colors: VytexColor<Schema>[];
	vytex_fabrics: VytexFabric<Schema>[];
	vytex_references: VytexReference<Schema>[];
	vytex_resources: VytexResource<Schema>[];
	vytex_suppliers: VytexSupplier<Schema>[];
	vytex_images: VytexImage<Schema>[];
	vytex_customs: VytexCustom<Schema>[];
	vytex_orders: VytexOrder<Schema>[];
}
