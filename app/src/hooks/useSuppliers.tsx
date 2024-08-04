import { type CreateQueryResult, createQuery } from '@tanstack/solid-query';
import { readSuppliers } from '@vytex/client';
import { type Accessor, type JSXElement, createContext, createMemo, createSignal, useContext } from 'solid-js';
import { client } from '~/lib/client';
import { queryClient } from '~/lib/queryClient';

const queryKey = 'supplierContext';

const SuppliersContext = createContext<SuppliersContext>({
	suppliersQuery: {} as CreateQueryResult<Suppliers>,
	suppliersRecord: () => ({}),
	setActive: () => {},
});

async function suppliersContextReq() {
	return await client.request(
		readSuppliers({
			limit: -1,
			fields: ['id', 'name', 'deleted_at'],
		}),
	);
}

export type Suppliers = Awaited<ReturnType<typeof suppliersContextReq>>;

type Supplier = Suppliers[number];

type SupplierRecord = Record<string, Supplier>;

type SuppliersContext = {
	suppliersQuery: CreateQueryResult;
	suppliersRecord: Accessor<SupplierRecord>;
	setActive: () => void;
};

export function SuppliersProvider(props: { children: JSXElement }) {
	const [enabled, setEnabled] = createSignal(false);
	const suppliers = createQuery(() => ({
		queryFn: suppliersContextReq,
		queryKey: [queryKey],
		staleTime: Number.POSITIVE_INFINITY,
		enabled: enabled(),
	}));

	const suppliersRecord = createMemo(() => {
		const obj = suppliers.data?.reduce((p: SupplierRecord, v) => {
			p[v.id] = v;
			return p;
		}, {});
		return obj || {};
	});

	const setActive = () => {
		setEnabled(true);
	};

	const values: SuppliersContext = {
		suppliersQuery: suppliers,
		suppliersRecord: suppliersRecord,
		setActive: setActive,
	};

	return <SuppliersContext.Provider value={values}>{props.children}</SuppliersContext.Provider>;
}

export function useSuppliers() {
	const context = useContext(SuppliersContext);
	context.setActive();
	return context;
}

export async function refetchSuppliers() {
	return await queryClient.refetchQueries({ queryKey: [queryKey], exact: true, type: 'active' });
}
