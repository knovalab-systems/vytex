import { A } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { AiOutlinePlus } from 'solid-icons/ai';
import { Match, Switch, createMemo, createSignal } from 'solid-js';
import AllowRoles from '~/components/AllowRoles';
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
	const pages = createMemo<number>(() => {
		const count = countFabrics.data?.at(0)?.count || 1;
		const safe = count === 0 ? 1 : count;
		return Math.ceil(safe / QUERY_LIMIT);
	});

	return (
		<div class='h-full w-full flex flex-col gap-2'>
			<div>
				<A href={FABRICS_CREATE_PATH}>
					<Button class='bg-purple-600 hover:bg-purple-700'>
						Nueva Tela <AiOutlinePlus class='ml-2' size={22} />
					</Button>
				</A>
			</div>
			<Switch>
				<Match when={fabrics.isLoading || countFabrics.isLoading}>
					<Loading label='Cargando telas' />
				</Match>
				<Match when={fabrics.isSuccess && countFabrics.isSuccess}>
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
