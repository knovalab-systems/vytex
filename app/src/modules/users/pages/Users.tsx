import { Match, Switch, createEffect, createResource, createSignal } from 'solid-js';
import {
	Pagination,
	PaginationEllipsis,
	PaginationItem,
	PaginationItems,
	PaginationNext,
	PaginationPrevious,
} from '~/components/ui/Pagination';
import { USER_STATUS } from '~/utils/constans';
import UserControls from '../components/UserControls';
import UserTable from '../components/UserTable';
import {
	countUsers,
	getDisabledUsers,
	getEnabledUsers,
	getUsers,
	getUsersbyName,
	getUsersbyUsername,
} from '../requests/userRequests';
import type { GetUsersType } from '../requests/userRequests';

function Users() {
	const [page, setPage] = createSignal(1);
	const [nameFilter, setNameFilter] = createSignal('');
	const [usernameFilter, setUsernameFilter] = createSignal('');
	const [statusFilter, setStatusFilter] = createSignal('');
	const [users, setUsers] = createSignal<GetUsersType>([]);
	const [_, setIsFiltering] = createSignal(false);
	const [usersCount] = createResource(countUsers);

	const fetchUsers = async (name: string, username: string, status: string, currentPage: number) => {
		const fetchFunctions = {
			name: name ? () => getUsersbyName(name, currentPage) : null,
			username: username ? () => getUsersbyUsername(username, currentPage) : null,
			status: status
				? status === USER_STATUS.inactive
					? () => getDisabledUsers(currentPage)
					: () => getEnabledUsers(currentPage)
				: null,
			default: () => getUsers(currentPage),
		};

		const key =
			Object.keys(fetchFunctions).find(
				key => fetchFunctions[key as 'name' | 'username' | 'status' | 'default'] !== null,
			) || 'default';
		const fetchFunction = fetchFunctions[key as 'name' | 'username' | 'status' | 'default'];
		return fetchFunction ? (await fetchFunction()) ?? [] : [];
	};

	createEffect(async () => {
		const name = nameFilter().toLowerCase();
		const username = usernameFilter().toLowerCase();
		const status = statusFilter();
		const currentPage = page();

		const fetchedUsers = await fetchUsers(name, username, status, currentPage);

		console.log('fetchedUsers:', fetchedUsers);

		setUsers(fetchedUsers);
	});

	const filteredUsers = () => {
		const nameFilterValue = nameFilter().toLowerCase();
		const usernameFilterValue = usernameFilter().toLowerCase();
		const statusFilterValue = statusFilter();

		setIsFiltering(!!(nameFilterValue || usernameFilterValue || statusFilterValue));

		return users()?.filter(
			user => (!nameFilterValue || (user.name || '').toLowerCase().includes(nameFilterValue)) &&
				(!usernameFilterValue || (user.username || '').toLowerCase().includes(usernameFilterValue)) &&
				(!statusFilterValue ||
					(statusFilterValue === USER_STATUS.inactive ? user.deleteAt !== null :
						(statusFilterValue === USER_STATUS.active ? !user.deleteAt : true)))
		) || [];
	};

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
					/>
					<UserTable users={filteredUsers()} />
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
