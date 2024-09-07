import { createQuery } from '@tanstack/solid-query';
import { Match, Switch, createMemo, createSignal } from 'solid-js';
import ActionsCell from '~/components/ActionsCell';
import AllowRoles from '~/components/AllowRoles';
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
import { REFS_PRO_SUPERVISOR_PATH, REFS_TIMES_PATH } from '~/constants/paths';
import ReferenceTable from '../components/ReferenceTable';
import { countReferencesQuery, getReferencesQuery } from '../requests/referenceGet';

function ReferencesProSupervisor() {
	return (
		<AllowRoles roles={['prosupervisor']}>
			<ReferencesProSupervisorPage />
		</AllowRoles>
	);
}

function ReferencesProSupervisorPage() {
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
					<ReferenceTable
						references={references.data}
						actions={reference => (
							<ActionsCell
								actions={[
									{
										icon: 'update',
										label: 'Tiempos',
										title: 'Actualizar tiempos',
										path: `${REFS_TIMES_PATH}/${reference}`,
									},
									{
										icon: 'details',
										label: 'Detalles',
										title: 'Detalles de la referencia',
										path: `${REFS_PRO_SUPERVISOR_PATH}/${reference}`,
									},
								]}
							/>
						)}
					/>
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

export default ReferencesProSupervisor;
