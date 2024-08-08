import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import AllowRoles from '~/components/AllowRoles';
import Loading from '~/components/Loading';
import UserCard from '../components/UserCard';
import { getUserQuery } from '../requests/userGet';

function User() {
	return (
		<AllowRoles roles={['admin']}>
			<UserPage />
		</AllowRoles>
	);
}

function UserPage() {
	const params = useParams();
	const user = createQuery(() => getUserQuery(params.id));

	return (
		<div class='flex items-center justify-center h-full'>
			<Switch>
				<Match when={user.isLoading}>
					<Loading label='Cargando usuario' />
				</Match>
				<Match when={user.isSuccess}>{<UserCard user={user.data} />}</Match>
			</Switch>
		</div>
	);
}

export default User;
