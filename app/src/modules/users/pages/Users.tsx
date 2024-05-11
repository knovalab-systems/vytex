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
import { countUsers, getUsers, getUsersbyName, getUsersbyUsername } from '../requests/userRequests';
import type { GetUsersType } from '../requests/userRequests';

function Users() {
	const [page, setPage] = createSignal(1);
	const [nameFilter, setNameFilter] = createSignal('');
	const [usernameFilter, setUsernameFilter] = createSignal('');
	const [users, setUsers] = createSignal<GetUsersType>([]);
	const [isFiltering, setIsFiltering] = createSignal(false);
	// const [users] = createResource(page, getUsers);
	const [usersCount] = createResource(countUsers);

	createEffect(async () => {
		const name = nameFilter();
		const username = usernameFilter();
		const currentPage = page();
		let fetchedUsers: GetUsersType;

		if (name) {
			fetchedUsers = await getUsersbyName(name, currentPage);
		} else if (username) {
			fetchedUsers = await getUsersbyUsername(username, currentPage);
		} else {
			fetchedUsers = await getUsers(currentPage);
		}

		setUsers(fetchedUsers);
	});

	const filteredUsers = () => {
		const nameFilterValue = nameFilter().toLowerCase();
		const usernameFilterValue = usernameFilter().toLowerCase();

		setIsFiltering(!!(nameFilterValue || usernameFilterValue));

		return users()?.filter(
			user => (!nameFilterValue || (user.name || '').toLowerCase().includes(nameFilterValue)) &&
				(!usernameFilterValue || (user.username || '').toLowerCase().includes(usernameFilterValue))
		) || [];
	};

	return (
		<Switch>
			<Match when={(users()?.length ?? 0) > 0 && usersCount.state === 'ready'}>
				<div class='h-full'>
					<UserControls setNameFilter={setNameFilter} setUsernameFilter={setUsernameFilter} />
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
