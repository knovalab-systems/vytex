import { Match, Switch, createMemo, createSignal } from 'solid-js';
import Loading from '~/components/Loading';
import {
	Pagination,
	PaginationEllipsis,
	PaginationItem,
	PaginationItems,
	PaginationNext,
	PaginationPrevious,
} from '~/components/ui/Pagination';
import UserTable from '../components/UserTable';
import { countUsersQuery, getUsersQuery } from '../requests/userRequests';
import { createQuery } from '@tanstack/solid-query';
import { QUERY_LIMIT } from '~/utils/constans';

function Users() {
	const [page, setPage] = createSignal(1);
	const users = createQuery(() => getUsersQuery(page()));
	const usersCount = createQuery(countUsersQuery);
	const pages = createMemo<number>(() => {
		const count = usersCount.data?.at(0)?.count || 1;
		const safe = count === 0 ? 1 : count;
		return Math.ceil(safe / QUERY_LIMIT);
	});

	return (
		<Switch>
			<Match when={users.isPending || usersCount.isPending}>
				<Loading />
			</Match>
			<Match when={users.isSuccess && users.isSuccess}>
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
	);
}

export default Users;
