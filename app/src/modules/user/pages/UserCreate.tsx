import { Match, Switch } from 'solid-js';
import AllowPolicies from '~/components/AllowPolicies';
import ErrorMessage from '~/components/ErrorMessage';
import Loading from '~/components/Loading';
import { useRoles } from '~/hooks/useRoles';
import UserCreateForm from '../components/UserCreateForm';

function UserCreate() {
	return (
		<AllowPolicies policies={['CreateUsers']}>
			<UserCreatePage />
		</AllowPolicies>
	);
}

function UserCreatePage() {
	const { rolesQuery } = useRoles();
	return (
		<div class='flex items-center justify-center h-full'>
			<Switch>
				<Match when={rolesQuery.isError}>
					<ErrorMessage title='Error al cargar usuarios' />
				</Match>
				<Match when={rolesQuery.isLoading}>
					<Loading label='Cargando usuario' />
				</Match>
				<Match when={rolesQuery.isSuccess}>
					<UserCreateForm />
				</Match>
			</Switch>
		</div>
	);
}

export default UserCreate;
