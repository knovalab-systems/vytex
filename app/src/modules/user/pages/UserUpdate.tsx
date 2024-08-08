import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import AllowRoles from '~/components/AllowRoles';
import Loading from '~/components/Loading';
import UserUpdateForm from '../components/UserUpdateForm';
import { getUserQuery } from '../requests/userGet';

function UserUpdate() {
	return (
		<AllowRoles roles={['admin']}>
			<UserUpdatePage />
		</AllowRoles>
	);
}

function UserUpdatePage() {
	const params = useParams();
	const user = createQuery(() => getUserQuery(params.id));

	return (
		<div class='flex items-center justify-center h-full'>
			<Switch>
				<Match when={user.isFetching}>
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
