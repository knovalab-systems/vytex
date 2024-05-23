import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { getUserQuery } from '../requests/getUserRequests';
import { Match, Switch } from 'solid-js';
import Loading from '~/components/Loading';

function UserUpdate() {
	const params = useParams();
	const user = createQuery(() => getUserQuery(params.id));

	return (
		<div class='flex items-center justify-center h-full'>
			<Switch>
				<Match when={user.isPending}>
					<Loading label='Cargando usuario' />
				</Match>
				<Match when={user.isSuccess}>{params.id}</Match>
			</Switch>
		</div>
	);
}

export default UserUpdate;
