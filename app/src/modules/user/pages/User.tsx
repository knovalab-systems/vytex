import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import AllowPolicies from '~/components/AllowPolicies';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import UserCard from '../components/UserCard';
import { getUserQuery } from '../requests/userGet';

function User() {
	return (
		<AllowPolicies policies={['ReadUsers']}>
			<UserPage />
		</AllowPolicies>
	);
}

function UserPage() {
	const params = useParams();
	const user = createQuery(() => getUserQuery(params.id));

	return (
		<div class='flex items-center justify-center h-full'>
			<Switch>
				<Match when={user.isError}>
					<ErrorMessage title='Error al cargar usuario' />
				</Match>
				<Match when={user.isLoading}>
					<Loading label='Cargando usuario' />
				</Match>
				<Match when={user.isSuccess}>{<UserCard user={user.data} />}</Match>
			</Switch>
		</div>
	);
}

export default User;
