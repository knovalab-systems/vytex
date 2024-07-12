import type { VytexColor } from './color.js';
import type { VytexFabric } from './fabric.js';
import type { VytexImage } from './image.js';
import type { VytexResource } from './resource.js';
import type { VytexSupplier } from './supplier.js';
import type { VytexUser } from './user.js';

export interface CoreSchema<Schema extends object = object> {
	vytex_users: VytexUser<Schema>[];
	vytex_colors: VytexColor<Schema>[];
	vytex_fabrics: VytexFabric<Schema>[];
	vytex_resources: VytexResource<Schema>[];
	vytex_suppliers: VytexSupplier<Schema>[];
	vytex_images: VytexImage<Schema>[];
}
