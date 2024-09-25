import { type CreateQueryResult, createQuery } from '@tanstack/solid-query';
import { readOrderStatus } from '@vytex/client';
import { type Accessor, type JSXElement, createContext, createMemo, createSignal, useContext } from 'solid-js';
import { client } from '~/lib/client';

const queryKey = 'orderStatusContext';

const OrderStatusContext = createContext<OrderStatusContext>({
	orderStatusQuery: {} as CreateQueryResult<OrderStatus>,
	getOrderStatusRecord: () => ({}),
	setActive: () => {},
	getStatuByValue: () => undefined,
});

async function orderStatusContextRequest() {
	return await client.request(
		readOrderStatus({
			limit: -1,
		}),
	);
}

export type OrderStatus = Awaited<ReturnType<typeof orderStatusContextRequest>>;

type OrderState = OrderStatus[number];

type OrderStatusRecord = Record<number, OrderState>;

type OrderStatusContext = {
	orderStatusQuery: CreateQueryResult;
	getOrderStatusRecord: Accessor<OrderStatusRecord>;
	setActive: () => void;
	getStatuByValue: (value: OrderState['value']) => OrderState | undefined;
};

export function OrderStatusProvider(props: { children: JSXElement }) {
	const [enabled, setEnabled] = createSignal(false);
	const orderStatusQuery = createQuery(() => ({
		queryFn: orderStatusContextRequest,
		queryKey: [queryKey],
		staleTime: Number.POSITIVE_INFINITY,
		enabled: enabled(),
	}));

	const getOrderStatusRecord = createMemo(() => {
		const obj = orderStatusQuery.data?.reduce((p: OrderStatusRecord, v) => {
			p[v.id] = v;
			return p;
		}, {});
		return obj || {};
	});

	const getStatuByValue = (value: OrderState['value']) => orderStatusQuery.data?.find(e => e.value === value);

	const setActive = () => {
		setEnabled(true);
	};

	const values: OrderStatusContext = {
		orderStatusQuery,
		getOrderStatusRecord,
		setActive,
		getStatuByValue,
	};

	return <OrderStatusContext.Provider value={values}>{props.children}</OrderStatusContext.Provider>;
}

export function useOrderStatus() {
	const context = useContext(OrderStatusContext);
	context.setActive();
	return context;
}
