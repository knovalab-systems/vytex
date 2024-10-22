import { type CreateQueryResult, createQuery } from '@tanstack/solid-query';
import { readRoles } from '@vytex/client';
import { type Accessor, type JSXElement, createContext, createMemo, createSignal, useContext } from 'solid-js';
import { client } from '~/lib/client';
import { queryClient } from '~/lib/queryClient';

const queryKey = 'rolContext';

const RolesContext = createContext<RolesContext>({
	rolesQuery: {} as CreateQueryResult<Roles>,
	getRolesRecord: () => ({}),
	setActive: () => {},
	getRoles: () => [],
});

async function rolesContextReq() {
	return await client.request(
		readRoles({
			limit: -1,
			fields: ['id', 'name'],
		}),
	);
}

export type Roles = Awaited<ReturnType<typeof rolesContextReq>>;

type Role = Roles[number];

type RolesRecord = Record<string, Role>;

type RolesContext = {
	rolesQuery: CreateQueryResult<Roles>;
	getRoles: Accessor<Roles>;
	getRolesRecord: Accessor<RolesRecord>;
	setActive: () => void;
};

export function RolesProvider(props: { children: JSXElement }) {
	const [enabled, setEnabled] = createSignal(false);
	const rolesQuery = createQuery(() => ({
		queryFn: rolesContextReq,
		queryKey: [queryKey],
		staleTime: Number.POSITIVE_INFINITY,
		enabled: enabled(),
	}));

	const getRolesRecord = createMemo(() => {
		const obj = rolesQuery.data?.reduce((p: RolesRecord, v) => {
			p[v.id] = v;
			return p;
		}, {});
		return obj ?? {};
	});

	const getRoles = createMemo(() => rolesQuery.data ?? []);

	const setActive = () => {
		setEnabled(true);
	};

	const values: RolesContext = { rolesQuery, getRolesRecord, setActive, getRoles };

	return <RolesContext.Provider value={values}>{props.children}</RolesContext.Provider>;
}

export function useRoles() {
	const context = useContext(RolesContext);
	context.setActive();
	return context;
}

export async function refetchRoles() {
	return await queryClient.refetchQueries({ queryKey: [queryKey], exact: true, type: 'active' });
}
