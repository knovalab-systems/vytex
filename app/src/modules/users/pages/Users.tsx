import UserTable from '../components/UserTable';
import { Match, Switch, createResource, createSignal } from 'solid-js';
import { getUsers } from '../requests/userRequests';
import {
	Pagination,
	PaginationEllipsis,
	PaginationItem,
	PaginationItems,
	PaginationNext,
	PaginationPrevious,
} from '~/components/ui/Pagination';

function Users() {
	const [page, setPage] = createSignal(1);
	const [users] = createResource(page, getUsers);

	return (
		<Switch>
			<Match when={users.state === 'ready'}>
				<div class='h-full'>
					<UserTable users={users()} />
					<Pagination
						class='pt-2 [&>*]:justify-center'
						count={2 /** pending for count fetch */}
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
