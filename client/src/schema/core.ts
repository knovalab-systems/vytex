import type { VytexColor } from './color.js';
import type { VytexComposition } from './composition.js';
import type { VytexCustom } from './custom.js';
import type { VytexFabric } from './fabric.js';
import type { VytexImage } from './image.js';
import type { VytexOrder } from './order.js';
import type { VytexOrderState } from './orderState.js';
import type {
	VytexColorByReference,
	VytexFabricByReference,
	VytexReference,
	VytexResourceByReference,
} from './reference.js';
import type { VytexResource } from './resource.js';
import type { VytexRole } from './role.js';
import type { VytexStep } from './step.js';
import type { VytexSupplier } from './supplier.js';
import type { VytexTask } from './task.js';
import type { VytexTaskControl } from './taskControl.js';
import type { VytexTimeByTask } from './timeByTask.js';
import type { VytexUser } from './user.js';

export interface CoreSchema<Schema = any> {
	vytex_users: VytexUser<Schema>[];
	vytex_colors: VytexColor<Schema>[];
	vytex_compositions: VytexComposition<Schema>[];
	vytex_fabrics: VytexFabric<Schema>[];
	vytex_references: VytexReference<Schema>[];
	vytex_resources: VytexResource<Schema>[];
	vytex_suppliers: VytexSupplier<Schema>[];
	vytex_images: VytexImage<Schema>[];
	vytex_customs: VytexCustom<Schema>[];
	vytex_orders: VytexOrder<Schema>[];
	'vytex_time-by-task': VytexTimeByTask<Schema>[];
	vytex_roles: VytexRole<Schema>[];
	'vytex_order-status': VytexOrderState<Schema>[];
	vytex_color_by_reference: VytexColorByReference<Schema>[];
	vytex_fabric_by_reference: VytexFabricByReference<Schema>[];
	vytex_reference_by_reference: VytexResourceByReference<Schema>[];
	vytex_steps: VytexStep<Schema>[];
	vytex_tasks: VytexTask<Schema>[];
	'vytex_task-controls': VytexTaskControl<Schema>[];
}
