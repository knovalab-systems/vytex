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
import { REFS_CREATE_PATH } from '~/constants/paths';
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
					<div>
						<CreateButton to={REFS_CREATE_PATH} policy='CreateReferences' label='Nueva Referencia' />
					</div>
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
