import { Match, Switch, createEffect, createResource, createSignal } from 'solid-js';
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
import { countUsers, getFiltertUsers } from '../requests/userRequests';
import type { GetUsersType } from '../requests/userRequests';

function Users() {
	const [page, setPage] = createSignal(1);
	const [nameFilter, setNameFilter] = createSignal('');
	const [usernameFilter, setUsernameFilter] = createSignal('');
	const [statusFilter, setStatusFilter] = createSignal('');
	const [roleIdFilter, setRoleIdFilter] = createSignal('');
	const [users, setUsers] = createSignal<GetUsersType>([]);
	const [usersCount] = createResource(countUsers);

	const fetchUsers = async (name: string, username: string, status: string, currentPage: number, roleId: string) => {
		console.log(status);

		const usersToFilter = await getFiltertUsers(name, username, roleId, status, currentPage);

		return usersToFilter;
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
						count={Number(usersCount()?.at(0)?.count) || 1 /** pending for count fetch */}
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
