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
import { FABRICS_CREATE_PATH } from '~/constants/paths';
import { useColors } from '~/hooks/useColors';
import FabricTable from '../components/FabricTable';
import { countFabricsQuery, getFabricsQuery } from '../requests/fabricGet';

function Fabrics() {
	return (
		<AllowPolicies policies={['ReadFabrics']}>
			<FabricsPage />
		</AllowPolicies>
	);
}

function FabricsPage() {
	const [page, setPage] = createSignal(1);
	const fabrics = createQuery(() => getFabricsQuery(page()));
	const countFabrics = createQuery(() => countFabricsQuery());
	const { colorsQuery } = useColors();
	const pages = createMemo<number>(() => {
		const count = countFabrics.data?.at(0)?.count || 1;
		const safe = count === 0 ? 1 : count;
		return Math.ceil(safe / QUERY_LIMIT);
	});

	const isLoading = () => fabrics.isLoading || colorsQuery.isLoading || countFabrics.isLoading;
	const isError = () => fabrics.isError || colorsQuery.isError || countFabrics.isError;
	const isSuccess = () => fabrics.isSuccess && colorsQuery.isSuccess && countFabrics.isSuccess;

	return (
		<div class='h-full w-full flex flex-col gap-2'>
			<Switch>
				<Match when={isError()}>
					<ErrorMessage title='Error al cargar telas' />
				</Match>
				<Match when={isLoading()}>
					<Loading label='Cargando telas' />
				</Match>
				<Match when={isSuccess()}>
					<div>
						<CreateButton to={FABRICS_CREATE_PATH} policy='CreateFabrics' label='Nueva tela' />
					</div>
					<FabricTable fabrics={fabrics.data} />
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

export default Fabrics;
