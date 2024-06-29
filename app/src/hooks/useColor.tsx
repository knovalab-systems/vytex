import { type CreateQueryResult, createQuery } from '@tanstack/solid-query';
import { readColors } from '@vytex/client';
import { type JSXElement, createContext, useContext, createMemo, type Accessor, createSignal } from 'solid-js';
import RoleRoot from '~/hooks/roleRoot';
import { queryClient } from '~/lib/queryClient';
import { client } from '~/utils/client';

const key = 'colorContext';

const ColorContext = createContext<colorContext>({
	colorsArray: {} as CreateQueryResult<colorsArray>,
	colorRecord: () => ({}),
	setActive: () => {},
});

async function coloContextReq() {
	return await client.request(
		readColors({
			limit: -1,
			fields: ['id', 'name', 'hex', 'delete_at'],
		}),
	);
}

export type colorsArray = Awaited<ReturnType<typeof coloContextReq>>;

type color = colorsArray[number];

type colorRecord = Record<string, color>;

type colorContext = {
	colorsArray: CreateQueryResult;
	colorRecord: Accessor<colorRecord>;
	setActive: () => void;
};

export function ColorProvider(props: { children: JSXElement }) {
	const { role } = RoleRoot;
	const [enabled, setEnabled] = createSignal(false);
	const colors = createQuery(() => ({
		queryFn: coloContextReq,
		queryKey: [key],
		staleTime: Number.POSITIVE_INFINITY,
		enabled: !!role() && enabled(),
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

	const values: colorContext = { colorsArray: colors, colorRecord: colorsObj, setActive: setActive };

	return <ColorContext.Provider value={values}>{props.children}</ColorContext.Provider>;
}

export function useColors() {
	const context = useContext(ColorContext);
	context.setActive();
	return context;
}

export async function name() {
	return await queryClient.refetchQueries({ queryKey: [key], exact: true, type: 'active' });
}
