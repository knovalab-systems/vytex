import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { Match, Switch } from 'solid-js';
import AllowPolicies from '~/components/AllowPolicies';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import RoleUpdateForm from '../components/RoleUpdateForm';
import { type GetRoleType, getRoleQuery } from '../requests/roleGet';

function RoleUpdate() {
	return (
		<AllowPolicies policies={['CreateRoles']}>
			<RoleUpdatePage />
		</AllowPolicies>
	);
}

function RoleUpdatePage() {
	const params = useParams();
	const role = createQuery(() => getRoleQuery(params.id));
	return (
		<div class='flex items-center justify-center h-full'>
			<Switch>
				<Match when={role.isError}>
					<ErrorMessage title='Error al cargar role' />
				</Match>
				<Match when={role.isFetching}>
					<Loading label='Cargando role' />
				</Match>
				<Match when={role.isSuccess}>
					<RoleUpdateForm role={role.data as GetRoleType} />
				</Match>
			</Switch>
		</div>
	);
}

export default RoleUpdate;
