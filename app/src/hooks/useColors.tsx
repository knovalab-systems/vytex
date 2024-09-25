import { type CreateQueryResult, createQuery } from '@tanstack/solid-query';
import { readColors } from '@vytex/client';
import { type Accessor, type JSXElement, createContext, createMemo, createSignal, useContext } from 'solid-js';
import { client } from '~/lib/client';
import { queryClient } from '~/lib/queryClient';

const queryKey = 'colorContext';

const ColorsContext = createContext<ColorsContext>({
	colorsQuery: {} as CreateQueryResult<Colors>,
	getColorsRecord: () => ({}),
	getColors: () => [],
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
	getColorsRecord: Accessor<ColorsRecord>;
	getColors: Accessor<Colors>;
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

	const getColorsRecord = createMemo(() => {
		const obj = colorsQuery.data?.reduce((p: ColorsRecord, v) => {
			p[v.id] = v;
			return p;
		}, {});
		return obj || {};
	});

	const getColors = createMemo(() => colorsQuery.data ?? []);

	const setActive = () => {
		setEnabled(true);
	};

	const values: ColorsContext = { colorsQuery, getColorsRecord, setActive, getColors };

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
