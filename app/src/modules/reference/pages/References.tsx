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
import { REFS_CREATE_PATH } from '~/constants/paths';
import { usePolicies } from '~/hooks/usePolicies';
import ReferenceTable from '../components/ReferenceTable';
import { countReferencesQuery, getReferencesQuery } from '../requests/referenceGet';

function References() {
	return (
		<AllowPolicies policies={['ReadReferences']}>
			<ReferencesPage />
		</AllowPolicies>
	);
}

function ReferencesPage() {
	const { hasPolicy } = usePolicies();
	const [page, setPage] = createSignal(1);
	const references = createQuery(() => getReferencesQuery(page()));
	const countReferences = createQuery(() => countReferencesQuery());
	const pages = createMemo<number>(() => {
		const count = countReferences.data?.at(0)?.count || 1;
		const safe = count === 0 ? 1 : count;
		return Math.ceil(safe / QUERY_LIMIT);
	});

	return (
		<div class='h-full w-full flex flex-col gap-2'>
			<Switch>
				<Match when={references.isError || countReferences.isError}>
					<ErrorMessage title='Error al cargar referencias' />
				</Match>
				<Match when={references.isLoading || countReferences.isLoading}>
					<Loading label='Cargando referencias' />
				</Match>
				<Match when={references.isSuccess && countReferences.isSuccess}>
					<Show when={hasPolicy('CreateReferences')}>
						<div>
							<A href={REFS_CREATE_PATH}>
								<Button variant='new'>
									Nueva Referencia <AiOutlinePlus class='ml-2' size={22} />
								</Button>
							</A>
						</div>
					</Show>
					<ReferenceTable references={references.data} />
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

export default References;
