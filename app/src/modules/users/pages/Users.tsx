import UserTable from '../components/UserTable';
import { Match, Switch, createResource, createSignal } from 'solid-js';
import { getUsers } from '../requests/userRequests';

function Users() {
	const [page, setPage] = createSignal(1);
	const [users] = createResource(page(), getUsers);

	setPage(1);

	return (
		<Switch>
			<Match when={users.state === 'ready'}>
				<div class='h-full'>
					<UserTable users={users()} />
				</div>
			</Match>
		</Switch>
	);
}

export default Users;
