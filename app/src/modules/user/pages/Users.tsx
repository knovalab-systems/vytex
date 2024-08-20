import { createQuery } from '@tanstack/solid-query';
import { Match, Switch, createMemo, createSignal } from 'solid-js';
import AllowRoles from '~/components/AllowRoles';
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
import UserControls from '../components/UserControls';
import UserTable from '../components/UserTable';
import { countUsersQuery, getUsersQuery } from '../requests/userGet';

function Users() {
	return (
		<AllowRoles roles={['admin']}>
			<UsersPage />
		</AllowRoles>
	);
}

function UsersPage() {
	const [page, setPage] = createSignal(1);
	const [nameFilter, setNameFilter] = createSignal('');
	const [usernameFilter, setUsernameFilter] = createSignal('');
	const [statusFilter, setStatusFilter] = createSignal('');
	const [roleIdFilter, setRoleIdFilter] = createSignal('');
	const users = createQuery(() =>
		getUsersQuery(nameFilter(), usernameFilter(), roleIdFilter(), statusFilter(), page()),
	);
	const usersCount = createQuery(() => countUsersQuery(nameFilter(), usernameFilter(), roleIdFilter(), statusFilter()));
	const pages = createMemo<number>(() => {
		const count = usersCount.data?.at(0)?.count || 1;
		const safe = count === 0 ? 1 : count;
		return Math.ceil(safe / QUERY_LIMIT);
	});

	return (
		<div class='h-full flex flex-col gap-2'>
			<UserControls
				setPage={() => setPage(1)}
				setNameFilter={setNameFilter}
				nameFilterValue={nameFilter()}
				setUsernameFilter={setUsernameFilter}
				usernameFilterValue={usernameFilter()}
				setStatusFilter={setStatusFilter}
				statusFilterValue={statusFilter()}
				setRoleIdFilter={setRoleIdFilter}
				roleIdFilterValue={roleIdFilter()}
			/>
			<Switch>
				<Match when={users.isLoading && usersCount.isLoading}>
					<Loading label='Cargando usuario' />
				</Match>
				<Match when={users.isSuccess && usersCount.isSuccess}>
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
