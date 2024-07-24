import { updateSupplier } from '@vytex/client';
import { client } from '~/lib/client';
import type { Supplier } from '~/schemas/core';

export async function updateSupplierRequest(id: number, supplier: Supplier) {
	return await client.request(updateSupplier(id, supplier));
}
