import { createSupplier } from '@vytex/client';
import { client } from '~/lib/client';
import type { Supplier } from '~/types/core';

export async function createSupplierRequest(supplier: Supplier) {
	return await client.request(createSupplier(supplier));
}
