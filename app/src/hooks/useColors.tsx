import { type CreateQueryResult, createQuery } from '@tanstack/solid-query';
import { readColors } from '@vytex/client';
import { type Accessor, type JSXElement, createContext, createMemo, createSignal, useContext } from 'solid-js';
import { client } from '~/lib/client';
import { queryClient } from '~/lib/queryClient';

const queryKey = 'colorContext';

const ColorsContext = createContext<ColorsContext>({
	colorsQuery: {} as CreateQueryResult<Colors>,
	colorsRecord: () => ({}),
	setActive: () => {},
});

async function colorsContextReq() {
	return await client.request(
		readColors({
			limit: -1,
			fields: ['id', 'name', 'hex', 'deleted_at'],
		}),
	);
}

export type Colors = Awaited<ReturnType<typeof colorsContextReq>>;

type Color = Colors[number];

type ColorsRecord = Record<string, Color>;

type ColorsContext = {
	colorsQuery: CreateQueryResult<Colors>;
	colorsRecord: Accessor<ColorsRecord>;
	setActive: () => void;
};

export function ColorsProvider(props: { children: JSXElement }) {
	const [enabled, setEnabled] = createSignal(false);
	const colorsQuery = createQuery(() => ({
		queryFn: colorsContextReq,
		queryKey: [queryKey],
		staleTime: Number.POSITIVE_INFINITY,
		enabled: enabled(),
	}));

	const colorsRecord = createMemo(() => {
		const obj = colorsQuery.data?.reduce((p: ColorsRecord, v) => {
			p[v.id] = v;
			return p;
		}, {});
		return obj || {};
	});

	const setActive = () => {
		setEnabled(true);
	};

	const values: ColorsContext = { colorsQuery, colorsRecord, setActive };

	return <ColorsContext.Provider value={values}>{props.children}</ColorsContext.Provider>;
}

export function useColors() {
	const context = useContext(ColorsContext);
	context.setActive();
	return context;
}

export async function refetchColors() {
	return await queryClient.refetchQueries({ queryKey: [queryKey], exact: true, type: 'active' });
}
