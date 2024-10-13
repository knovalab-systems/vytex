import { createQuery } from '@tanstack/solid-query';
import { Match, Switch, createMemo, createSignal } from 'solid-js';
import AllowPolicies from '~/components/AllowPolicies';
import CreateButton from '~/components/CreateButton';
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
			<div class='ml-auto'>
				<CreateButton to={CUSTOMS_CREATE_PATH} policy='CreateCustoms' label='Nuevo Pedido' />
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
