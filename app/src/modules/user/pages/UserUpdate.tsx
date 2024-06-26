import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import Loading from '~/components/Loading';
import UserUpdateForm from '../components/UserUpdateForm';
import { getUserQuery } from '../requests/userGetRequests';

function UserUpdate() {
	const params = useParams();
	const user = createQuery(() => getUserQuery(params.id));

	return (
		<div class='flex items-center justify-center h-full'>
			<Switch>
				<Match when={user.isPending || user.isRefetching}>
					<Loading label='Cargando usuario' />
				</Match>
				<Match when={user.isSuccess}>
					<UserUpdateForm user={user.data} />
				</Match>
			</Switch>
		</div>
	);
}

export default UserUpdate;
