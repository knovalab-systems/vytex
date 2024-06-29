import { type CreateQueryResult, createQuery } from '@tanstack/solid-query';
import { readColors } from '@vytex/client';
import { type JSXElement, createContext, useContext, createMemo, type Accessor, createSignal } from 'solid-js';
import RoleRoot from '~/hooks/roleRoot';
import { queryClient } from '~/lib/queryClient';
import { client } from '~/utils/client';

const queryKey = 'colorContext';

const ColorsContext = createContext<colorsContext>({
	colorsArray: {} as CreateQueryResult<colorsArray>,
	colorRecord: () => ({}),
	setActive: () => {},
});

async function colorsContextReq() {
	return await client.request(
		readColors({
			limit: -1,
			fields: ['id', 'name', 'hex', 'delete_at'],
		}),
	);
}

export type colorsArray = Awaited<ReturnType<typeof colorsContextReq>>;

type color = colorsArray[number];

type colorRecord = Record<string, color>;

type colorsContext = {
	colorsArray: CreateQueryResult;
	colorRecord: Accessor<colorRecord>;
	setActive: () => void;
};

export function ColorsProvider(props: { children: JSXElement }) {
	const { role } = RoleRoot;
	const [enabled, setEnabled] = createSignal(false);
	const colors = createQuery(() => ({
		queryFn: colorsContextReq,
		queryKey: [queryKey],
		staleTime: Number.POSITIVE_INFINITY,
		enabled: Boolean(role()) && enabled(),
	}));

	const colorsObj = createMemo(() => {
		const obj = colors.data?.reduce((p: colorRecord, v) => {
			p[v.id] = v;
			return p;
		}, {});
		return obj || {};
	});

	const setActive = () => {
		setEnabled(true);
	};

	const values: colorsContext = { colorsArray: colors, colorRecord: colorsObj, setActive: setActive };

	return <ColorsContext.Provider value={values}>{props.children}</ColorsContext.Provider>;
}

export function useColors() {
	const context = useContext(ColorsContext);
	context.setActive();
	return context;
}

export async function name() {
	return await queryClient.refetchQueries({ queryKey: [queryKey], exact: true, type: 'active' });
}
