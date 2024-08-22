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
import { REFS_CREATE_PATH } from '~/constants/paths';
import ReferenceTable from '../components/ReferenceTable';
import { countReferencesQuery, getReferencesQuery } from '../requests/referenceGet';

function References() {
	return (
		<AllowRoles roles={['designer']}>
			<ReferencesPage />
		</AllowRoles>
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
			<div>
				<A href={REFS_CREATE_PATH}>
					<Button variant='new'>
						Nueva Referencia <AiOutlinePlus class='ml-2' size={22} />
					</Button>
				</A>
			</div>
			<Switch>
				<Match when={references.isLoading || countReferences.isLoading}>
					<Loading label='Cargando referencias' />
				</Match>
				<Match when={references.isSuccess && countReferences.isSuccess}>
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
