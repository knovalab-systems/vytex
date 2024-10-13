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
import { USER_CREATE_PATH } from '~/constants/paths';
import { useRoles } from '~/hooks/useRoles';
import type { UserFilter } from '~/types/filter';
import UserFilters from '../components/UserFilters';
import UserTable from '../components/UserTable';
import { countUsersQuery, getUsersQuery } from '../requests/userGet';

function Users() {
	return (
		<AllowPolicies policies={['ReadUsers']}>
			<UsersPage />
		</AllowPolicies>
	);
}

function UsersPage() {
	const { rolesQuery } = useRoles();
	const [page, setPage] = createSignal(1);
	const [filters, setFilters] = createSignal<UserFilter>({});
	const users = createQuery(() => getUsersQuery(page(), filters()));
	const usersCount = createQuery(() => countUsersQuery(filters()));
	const pages = createMemo<number>(() => {
		const count = usersCount.data?.at(0)?.count || 1;
		const safe = count === 0 ? 1 : count;
		return Math.ceil(safe / QUERY_LIMIT);
	});

	const isError = () => users.isError || usersCount.isError || rolesQuery.isError;
	const isLoading = () => users.isLoading || usersCount.isLoading || rolesQuery.isLoading;
	const isSuccess = () => users.isSuccess && usersCount.isSuccess && rolesQuery.isSuccess;

	return (
		<div class='h-full flex flex-col gap-2'>
			<Switch>
				<Match when={isError()}>
					<ErrorMessage title='Error al cargar usuarios' />
				</Match>
				<Match when={isLoading()}>
					<Loading label='Cargando usuarios' />
				</Match>
				<Match when={isSuccess()}>
					<div class='flex justify-between'>
						<UserFilters setFilters={setFilters} filters={filters()} />
						<CreateButton to={USER_CREATE_PATH} class='w-full' policy='CreateUsers' label='Nuevo usuario' />
					</div>
					<UserTable users={users.data} />
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

export default Users;
