import { createQuery } from '@tanstack/solid-query';
import { Match, Switch, createMemo, createSignal } from 'solid-js';
import AllowPolicies from '~/components/AllowPolicies';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import {
	Pagination,
	PaginationEllipsis,
	PaginationItem,
	PaginationItems,
	PaginationNext,
	PaginationPrevious,
} from '~/components/ui/Pagination';
import { useColors } from '~/hooks/useColors';
import { useOrderStatus } from '~/hooks/useOrderStatus';
import OrderTable from '../components/OrderTable';
import { countOrdersQuery, getOrdersQuery } from '../request/orderGet';

function Orders() {
	return (
		<AllowPolicies policies={['ReadOrders']}>
			<OrdersPage />
		</AllowPolicies>
	);
}

function OrdersPage() {
	const [page, setPage] = createSignal(1);
	const { colorsQuery } = useColors();
	const orders = createQuery(() => getOrdersQuery(page()));
	const { orderStatusQuery } = useOrderStatus();
	const countOrders = createQuery(() => countOrdersQuery());
	const pages = createMemo<number>(() => {
		const count = countOrders.data?.at(0)?.count || 1;
		const safe = count === 0 ? 1 : count;
		return Math.ceil(safe / 10);
	});

	const isError = () => orders.isError || countOrders.isError || orderStatusQuery.isError || colorsQuery.isError;
	const isLoading = () =>
		orders.isLoading || countOrders.isLoading || orderStatusQuery.isLoading || colorsQuery.isLoading;
	const isSuccess = () =>
		orders.isSuccess && countOrders.isSuccess && orderStatusQuery.isSuccess && colorsQuery.isSuccess;

	return (
		<div class='h-full flex flex-col gap-2'>
			<Switch>
				<Match when={isError()}>
					<ErrorMessage title='Error al cargar pedidos' />
				</Match>
				<Match when={isLoading()}>
					<Loading label='Cargando ordenes' />
				</Match>
				<Match when={isSuccess()}>
					<OrderTable orders={orders.data} />
					<Pagination
						class='[&>*]:justify-center'
						count={pages()}
						page={page()}
						onPageChange={setPage}
						itemComponent={props => <PaginationItem page={props.page}>{props.page}</PaginationItem>}
						ellipsisComponent={() => <PaginationEllipsis />}
					>
						<PaginationPrevious />
						<PaginationItems />
						<PaginationNext />
					</Pagination>
				</Match>
			</Switch>
		</div>
	);
}

export default Orders;
