import { A } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { AiOutlinePlus } from 'solid-icons/ai';
import { Match, Switch, createMemo, createSignal } from 'solid-js';
import AllowPolicies from '~/components/AllowPolicies';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import { Button } from '~/components/ui/Button';
import {
	Pagination,
	PaginationEllipsis,
	PaginationItem,
	PaginationItems,
	PaginationNext,
	PaginationPrevious,
} from '~/components/ui/Pagination';
import { QUERY_LIMIT } from '~/constants/http';
import { CUSTOMS_CREATE_PATH } from '~/constants/paths';
import CustomTable from '../components/CustomTable';
import { countCustomsQuery, getCustomsQuery } from '../requests/CustomGet';

function Customs() {
	return (
		<AllowPolicies policies={['ReadCustoms']}>
			<CustomsPage />
		</AllowPolicies>
	);
}

function CustomsPage() {
	const [page, setPage] = createSignal(1);
	const customs = createQuery(() => getCustomsQuery(page()));
	const countCustoms = createQuery(() => countCustomsQuery());
	const pages = createMemo<number>(() => {
		const count = countCustoms.data?.at(0)?.count || 1;
		const safe = count === 0 ? 1 : count;
		return Math.ceil(safe / QUERY_LIMIT);
	});

	return (
		<div class='h-full flex flex-col gap-2'>
			<div>
				<A href={CUSTOMS_CREATE_PATH}>
					<Button variant='new'>
						Nuevo Pedido <AiOutlinePlus class='ml-2' size={22} />
					</Button>
				</A>
			</div>
			<Switch>
				<Match when={customs.isError || countCustoms.isError}>
					<ErrorMessage title='Error al cargar pedidos' />
				</Match>
				<Match when={customs.isLoading || countCustoms.isLoading}>
					<Loading label='Cargando pedidos' />
				</Match>
				<Match when={customs.isSuccess && countCustoms.isSuccess}>
					<CustomTable customs={customs.data} />
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

export default Customs;
