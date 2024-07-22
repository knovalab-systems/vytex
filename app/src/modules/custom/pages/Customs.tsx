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
import { QUERY_LIMIT } from '~/constants/http';
import CustomTable from '../components/CustomTable';
import { countCustomsQuery, getCustomsQuery } from '../requests/CustomGet';

function Customs() {
	const [page, setPage] = createSignal(1);
	const customs = createQuery(() => getCustomsQuery(page()));
	const countCustoms = createQuery(() => countCustomsQuery());
	const pages = createMemo<number>(() => {
		const count = countCustoms.data?.at(0)?.count || 1;
		const safe = count === 0 ? 1 : count;
		return Math.ceil(safe / QUERY_LIMIT);
	});

	return (
		<div class='h-full flex flex-col'>
			<Switch>
				<Match when={customs.isLoading || countCustoms.isLoading}>
					<Loading label='Cargando pedidos' />
				</Match>
				<Match when={customs.isSuccess && countCustoms.isSuccess}>
					<CustomTable customs={customs.data} />
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

export default Customs;
