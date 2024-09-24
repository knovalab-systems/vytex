import { createQuery } from '@tanstack/solid-query';
import { Match, Switch, createMemo, createSignal } from 'solid-js';
import AllowPolicies from '~/components/AllowPolicies';
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
import RoleTable from '../components/RoleTable';
import { type GetRolesType, countRolesQuery, getRolesQuery } from '../requests/roleGet';

function Roles() {
	return (
		<AllowPolicies policies={['ReadRoles']}>
			<RolesPage />
		</AllowPolicies>
	);
}

function RolesPage() {
	const [page, setPage] = createSignal(1);
	const roles = createQuery(() => getRolesQuery(page()));
	const rolesCount = createQuery(countRolesQuery);
	const pages = createMemo<number>(() => {
		const count = rolesCount.data?.at(0)?.count || 1;
		const safe = count === 0 ? 1 : count;
		return Math.ceil(safe / QUERY_LIMIT);
	});

	const isError = () => roles.isError || rolesCount.isError;
	const isLoading = () => roles.isLoading || rolesCount.isLoading;
	const isSuccess = () => roles.isSuccess && rolesCount.isSuccess;

	return (
		<div class='h-full flex flex-col gap-2'>
			<Switch>
				<Match when={isError()}>
					<ErrorMessage title='Error al cargar roles' />
				</Match>
				<Match when={isLoading()}>
					<Loading label='Cargando roles' />
				</Match>
				<Match when={isSuccess()}>
					<RoleTable roles={roles.data as GetRolesType} />
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

export default Roles;
