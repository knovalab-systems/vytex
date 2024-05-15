import { Match, Switch, createEffect, createResource, createSignal } from 'solid-js';
import Loading from '~/components/Loading';
import {
	Pagination,
	PaginationEllipsis,
	PaginationItem,
	PaginationItems,
	PaginationNext,
	PaginationPrevious,
} from '~/components/ui/Pagination';
import UserControls from '../components/UserControls';
import UserTable from '../components/UserTable';
import { getFilters } from '../filters/filters';
import { countUsers, getFetchFunction } from '../requests/userRequests';
import type { GetUsersType } from '../requests/userRequests';
import type { userType } from '../schema/schema';


function Users() {
	const [page, setPage] = createSignal(1);
	const [nameFilter, setNameFilter] = createSignal('');
	const [usernameFilter, setUsernameFilter] = createSignal('');
	const [statusFilter, setStatusFilter] = createSignal('');
	const [roleIdFilter, setRoleIdFilter] = createSignal('');
	const [users, setUsers] = createSignal<GetUsersType>([]);
	const [usersCount] = createResource(countUsers);

	const fetchUsers = async (name: string, username: string, status: string, currentPage: number, roleId: string) => {
		// role id to number
		const role = Number.parseInt(roleId);

		const { fetchFunction } = getFetchFunction(name, username, status, currentPage, role);

		const usersToFilter: GetUsersType = fetchFunction ? (await fetchFunction()) ?? [] : [];

		const filters = getFilters(name, username, status, role);

		const filteredUsers = filters.reduce((users: GetUsersType, filter) => {
			return (users as Array<userType>).filter(user => filter.filterFunction(user, filter.value as never));
		}, usersToFilter);

		return filteredUsers;
	};

	createEffect(async () => {
		const name = nameFilter().toLowerCase();
		const username = usernameFilter().toLowerCase();
		const status = statusFilter();
		const roleId = roleIdFilter();
		const currentPage = page();

		const fetchedUsers = await fetchUsers(name, username, status, currentPage, roleId);

		setUsers(fetchedUsers);
	});

	return (
		<Switch>
			<Match when={usersCount.loading}>
				<Loading />
			</Match>
			<Match when={usersCount.state === 'ready'}>
				<div class='h-full'>
					<UserControls
						setNameFilter={setNameFilter}
						nameFilterValue={nameFilter()}
						setUsernameFilter={setUsernameFilter}
						usernameFilterValue={usernameFilter()}
						setStatusFilter={setStatusFilter}
						statusFilterValue={statusFilter()}
						setRoleIdFilter={setRoleIdFilter}
						roleIdFilterValue={roleIdFilter()}
					/>
					<UserTable users={users()} />
					<Pagination
						class='pt-2 [&>*]:justify-center'
						count={Number(usersCount()?.at(0)?.count) || 1}
						page={page()}
						onPageChange={setPage}
						itemComponent={props => <PaginationItem page={props.page}>{props.page}</PaginationItem>}
						ellipsisComponent={() => <PaginationEllipsis />}
					>
						<PaginationPrevious />
						<PaginationItems />
						<PaginationNext />
					</Pagination>
				</div>
			</Match>
		</Switch>
	);
}

export default Users;
