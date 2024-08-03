import { createQuery } from '@tanstack/solid-query';
import { Match, Switch, createMemo, createSignal } from 'solid-js';
import Loading from '~/components/Loading';
import {
	Pagination,
	PaginationEllipsis,
	PaginationItem,
	PaginationItems,
	PaginationNext,
	PaginationPrevious,
} from '~/components/ui/Pagination';
import OrderTable from '../components/OrderTable';
import { countOrdersQuery, getOrdersQuery } from '../request/OrderGet';

function Orders() {
	const [page, setPage] = createSignal(1);
	const orders = createQuery(() => getOrdersQuery(page()));
	const countOrders = createQuery(() => countOrdersQuery());
	const pages = createMemo<number>(() => {
		const count = countOrders.data?.at(0)?.count || 1;
		const safe = count === 0 ? 1 : count;
		return Math.ceil(safe / 10);
	});

	return (
		<div class='h-full flex flex-col'>
			<Switch>
				<Match when={orders.isLoading || countOrders.isLoading}>
					<Loading label='Cargando ordenes' />
				</Match>
				<Match when={orders.isSuccess && countOrders.isSuccess}>
					<OrderTable orders={orders.data} />
					<Pagination
						class='pt-2 [&>*]:justify-center'
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
