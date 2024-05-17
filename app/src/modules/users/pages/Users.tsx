import { createQuery } from '@tanstack/solid-query';
import { Match, Switch, createEffect, createMemo, createSignal } from 'solid-js';
import Loading from '~/components/Loading';
import {
	Pagination,
	PaginationEllipsis,
	PaginationItem,
	PaginationItems,
	PaginationNext,
	PaginationPrevious,
} from '~/components/ui/Pagination';
import { QUERY_LIMIT } from '~/utils/constants';
import UserControls from '../components/UserControls';
import UserTable from '../components/UserTable';
import { countUsersQuery, getUsersQuery } from '../requests/getUserRequests';

function Users() {
	const [page, setPage] = createSignal(1);
	const [nameFilter, setNameFilter] = createSignal('');
	const [usernameFilter, setUsernameFilter] = createSignal('');
	const [statusFilter, setStatusFilter] = createSignal('');
	const [roleIdFilter, setRoleIdFilter] = createSignal('');
	const users = createQuery(() =>
		getUsersQuery(nameFilter(), usernameFilter(), roleIdFilter(), statusFilter(), page()),
	);
	const usersCount = createQuery(countUsersQuery);
	const pages = createMemo<number>(() => {
		const count = usersCount.data?.at(0)?.count || 1;
		const safe = count === 0 ? 1 : count;
		return Math.ceil(safe / QUERY_LIMIT);
	});

	const [showLoading, setShowLoading] = createSignal(false);

	createEffect(() => {
		if (users.isPending || usersCount.isPending) {
			setShowLoading(true);

			// minimum loading time
			const timer = setTimeout(() => {
				setShowLoading(false);
			}, 150);

			return () => clearTimeout(timer);
		}
	}, [users.isPending, usersCount.isPending]);

	return (
		<>
			<div class="sticky top-0 z-10 bg-white rounded">
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
			</div>
			<div class='overflow-auto'>
				<Switch>
					<Match when={showLoading()}>
						<Loading />
					</Match>
					<Match when={users.isSuccess && usersCount.isSuccess}>
						<div class='h-full flex flex-col'>
							<UserTable users={users.data} />
							<Pagination
								class='pt-2 [&>*]:justify-center'
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
						</div>
					</Match>
				</Switch>
			</div>
		</>
	);
}

export default Users;
