import { A } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { AiOutlinePlus } from 'solid-icons/ai';
import { Match, Switch, createMemo, createSignal } from 'solid-js';
import AllowRoles from '~/components/AllowRoles';
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
import { FABRICS_CREATE_PATH } from '~/constants/paths';
import { useColors } from '~/hooks/useColors';
import FabricTable from '../components/FabricTable';
import { countFabricsQuery, getFabricsQuery } from '../requests/fabricGet';

function Fabrics() {
	return (
		<AllowRoles roles={['designer']}>
			<FabricsPage />
		</AllowRoles>
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
			<div>
				<A href={FABRICS_CREATE_PATH}>
					<Button variant='new'>
						Nueva Tela <AiOutlinePlus class='ml-2' size={22} />
					</Button>
				</A>
			</div>
			<Switch>
				<Match when={isError()}>
					<ErrorMessage title='Error al cargar telas' />
				</Match>
				<Match when={isLoading()}>
					<Loading label='Cargando telas' />
				</Match>
				<Match when={isSuccess()}>
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
