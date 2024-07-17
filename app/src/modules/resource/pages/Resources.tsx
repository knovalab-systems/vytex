import { A } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { AiOutlinePlus } from 'solid-icons/ai';
import { Match, Switch, createMemo, createSignal } from 'solid-js';
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
import { RESOURCES_CREATE_PATH } from '~/constants/paths';
import { useColors } from '~/hooks/useColors';
import ResourceTable from '../components/ResourceTable';
import { countResourcesQuery, getResourcesQuery } from '../requests/resourceGet';

function Resources() {
	const [page, setPage] = createSignal(1);
	const resources = createQuery(() => getResourcesQuery(page()));
	const countResources = createQuery(() => countResourcesQuery());
	const { colorsQuery: colorsArray } = useColors();
	const pages = createMemo<number>(() => {
		const count = countResources.data?.at(0)?.count || 1;
		const safe = count === 0 ? 1 : count;
		return Math.ceil(safe / QUERY_LIMIT);
	});

	return (
		<div class='h-full w-full flex flex-col'>
			<div class='mb-2'>
				<A href={RESOURCES_CREATE_PATH}>
					<Button class='bg-purple-600 hover:bg-purple-700'>
						Nuevo Insumo <AiOutlinePlus class='ml-2' size={22} />
					</Button>
				</A>
			</div>
			<Switch>
				<Match when={resources.isLoading || countResources.isLoading || colorsArray.isLoading}>
					<Loading label='Cargando insumos' />
				</Match>
				<Match when={resources.isSuccess && countResources.isSuccess && colorsArray.isSuccess}>
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
