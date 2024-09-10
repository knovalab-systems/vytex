import { A } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { AiOutlinePlus } from 'solid-icons/ai';
import { Match, Show, Switch, createMemo, createSignal } from 'solid-js';
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
import { RESOURCES_CREATE_PATH } from '~/constants/paths';
import { useColors } from '~/hooks/useColors';
import { usePolicies } from '~/hooks/usePolicies';
import ResourceTable from '../components/ResourceTable';
import { countResourcesQuery, getResourcesQuery } from '../requests/resourceGet';

function Resources() {
	return (
		<AllowPolicies policies={['ReadResources']}>
			<ResourcesPage />
		</AllowPolicies>
	);
}

function ResourcesPage() {
	const [page, setPage] = createSignal(1);
	const resources = createQuery(() => getResourcesQuery(page()));
	const countResources = createQuery(() => countResourcesQuery());
	const { colorsQuery } = useColors();
	const { hasPolicy } = usePolicies();
	const pages = createMemo<number>(() => {
		const count = countResources.data?.at(0)?.count || 1;
		const safe = count === 0 ? 1 : count;
		return Math.ceil(safe / QUERY_LIMIT);
	});

	const isLoading = () => resources.isLoading || colorsQuery.isLoading || countResources.isLoading;
	const isError = () => resources.isError || colorsQuery.isError || countResources.isError;
	const isSuccess = () => resources.isSuccess && colorsQuery.isSuccess && countResources.isSuccess;

	return (
		<div class='h-full w-full flex flex-col gap-2'>
			<Switch>
				<Match when={isError()}>
					<ErrorMessage title='Error al cargar insumos' />
				</Match>
				<Match when={isLoading()}>
					<Loading label='Cargando insumos' />
				</Match>
				<Match when={isSuccess()}>
					<Show when={hasPolicy('CreateResources')}>
						<div>
							<A href={RESOURCES_CREATE_PATH}>
								<Button variant='new'>
									Nuevo Insumo <AiOutlinePlus class='ml-2' size={22} />
								</Button>
							</A>
						</div>
					</Show>
					<ResourceTable resources={resources.data} />
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

export default Resources;
