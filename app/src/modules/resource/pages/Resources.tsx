import { createQuery } from '@tanstack/solid-query';
import { Match, Switch, createMemo, createSignal } from 'solid-js';
import { countResourcesQuery, getResourcesQuery } from '../requests/resourcesGetRequests';
import { QUERY_LIMIT } from '~/utils/constants';
import Loading from '~/components/Loading';
import {
	Pagination,
	PaginationEllipsis,
	PaginationItem,
	PaginationItems,
	PaginationNext,
	PaginationPrevious,
} from '~/components/ui/Pagination';
import ResourceTable from '../components/ResourceTable';

function Resources() {
	const [page, setPage] = createSignal(1);
	const resources = createQuery(() => getResourcesQuery(page()));
	const countResources = createQuery(() => countResourcesQuery());
	const pages = createMemo<number>(() => {
		const count = countResources.data?.at(0)?.count || 1;
		const safe = count === 0 ? 1 : count;
		return Math.ceil(safe / QUERY_LIMIT);
	});

	return (
		<div class='h-full w-full flex flex-col'>
			<Switch>
				<Match when={resources.isLoading || countResources.isLoading}>
					<Loading label='Cargando insumos' />
				</Match>
				<Match when={resources.isSuccess && countResources.isSuccess}>
					<ResourceTable resources={resources.data} />
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

export default Resources;
